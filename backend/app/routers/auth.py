"""
Auth routes:
  POST /auth/signup           — email + password registration
  POST /auth/login            — email + password login
  GET  /auth/google           — returns Google OAuth consent URL
  GET  /auth/google/callback  — handles OAuth redirect, returns JWT
  GET  /auth/me               — returns current user info
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import CurrentUser
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
    response_model=TokenResponse,
    summary="Handle Google OAuth2 redirect",
)
async def google_callback(
    code: str,
    db: AsyncSession = Depends(get_db),
):
    try:
        user_info = await auth_service.exchange_google_code(code)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google OAuth failed: {str(e)}",
        )

    user = await auth_service.upsert_google_user(db, user_info)
    token = auth_service.issue_token(user)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.get(
    "/me",
    response_model=UserOut,
    summary="Get current authenticated user",
)
async def get_me(current_user: CurrentUser):
    return UserOut.model_validate(current_user)
