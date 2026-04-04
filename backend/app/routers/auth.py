"""
Auth routes:
  POST /auth/signup           — email + password registration
  POST /auth/login            — email + password login
  GET  /auth/google           — returns Google OAuth consent URL
  GET  /auth/google/callback  — handles OAuth redirect, redirects to frontend with JWT
  GET  /auth/me               — returns current user info
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import CurrentUser
from app.core.config import settings
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    TokenResponse,
    UserOut,
    GoogleAuthUrl,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register with email and password",
)
async def signup(
    req: SignupRequest,
    db: AsyncSession = Depends(get_db),
):
    user = await auth_service.signup_with_email(db, req)
    token = auth_service.issue_token(user)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login with email and password",
)
async def login(
    req: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    user = await auth_service.login_with_email(db, req)
    token = auth_service.issue_token(user)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.get(
    "/google",
    response_model=GoogleAuthUrl,
    summary="Get Google OAuth2 consent URL",
)
async def google_login():
    url = auth_service.get_google_auth_url()
    return GoogleAuthUrl(url=url)


@router.get(
    "/google/callback",
    summary="Handle Google OAuth2 redirect — redirects to frontend with JWT",
)
async def google_callback(
    code: str,
    db: AsyncSession = Depends(get_db),
):
    try:
        user_info = await auth_service.exchange_google_code(code)
    except Exception as e:
        # Redirect to frontend login page with error flag
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login?error=google_failed",
            status_code=302,
        )

    user = await auth_service.upsert_google_user(db, user_info)
    token = auth_service.issue_token(user)

    # Redirect to the frontend callback handler with JWT as query param
    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/auth/callback?token={token}",
        status_code=302,
    )


@router.get(
    "/me",
    response_model=UserOut,
    summary="Get current authenticated user",
)
async def get_me(current_user: CurrentUser):
    return UserOut.model_validate(current_user)
