"""
Google OAuth2 service.
Flow:
  1. /auth/google           → returns Google OAuth consent URL
  2. Google redirects to    → /auth/google/callback?code=...
  3. We exchange code       → access_token
  4. Fetch user info        → upsert User in DB
  5. Return our JWT
"""
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from urllib.parse import urlencode

from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest
from loguru import logger


# ── Google OAuth ──────────────────────────────────────────────────────────────

def get_google_auth_url() -> str:
    """Generate the Google OAuth consent screen URL."""
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
    }
    return f"{settings.GOOGLE_AUTH_URL}?{urlencode(params)}"


async def exchange_google_code(code: str) -> dict:
    """Exchange OAuth code for tokens and fetch user info from Google."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        # Step 1: Exchange code for tokens
        token_resp = await client.post(
            settings.GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        token_resp.raise_for_status()
        tokens = token_resp.json()

        # Step 2: Get user info
        userinfo_resp = await client.get(
            settings.GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {tokens['access_token']}"},
        )
        userinfo_resp.raise_for_status()
        return userinfo_resp.json()


async def upsert_google_user(db: AsyncSession, user_info: dict) -> User:
    """Create or update a user from Google profile data."""
    google_id = user_info.get("sub")
    email = user_info.get("email")

    # Try by google_id first
    result = await db.execute(select(User).where(User.google_id == google_id))
    user = result.scalar_one_or_none()

    if user is None:
        # Try by email (user may have registered with email/password before)
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

    if user is None:
        # New user
        user = User(
            email=email,
            name=user_info.get("name"),
            picture=user_info.get("picture"),
            google_id=google_id,
        )
        db.add(user)
        await db.flush()
        logger.info(f"New user created via Google: {email}")
    else:
        # Update Google fields
        user.google_id = google_id
        user.name = user_info.get("name") or user.name
        user.picture = user_info.get("picture") or user.picture
        logger.info(f"Existing user logged in via Google: {email}")

    return user


# ── Email / Password Auth ─────────────────────────────────────────────────────

async def signup_with_email(db: AsyncSession, req: SignupRequest) -> User:
    """Register a new user with email + password."""
    result = await db.execute(select(User).where(User.email == req.email))
    existing = result.scalar_one_or_none()
    if existing:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        email=req.email,
        name=req.name,
        hashed_password=hash_password(req.password),
    )
    db.add(user)
    await db.flush()
    logger.info(f"New user signed up: {req.email}")
    return user


async def login_with_email(db: AsyncSession, req: LoginRequest) -> User:
    """Verify email + password and return the user."""
    from fastapi import HTTPException, status

    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()

    if user is None or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return user


def issue_token(user: User) -> str:
    """Create a JWT for the given user."""
    return create_access_token(
        subject=str(user.id),
        extra={"email": user.email, "name": user.name},
    )
