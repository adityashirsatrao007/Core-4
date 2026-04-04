from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    APP_NAME: str = "Tracelify"
    APP_ENV: str = "development"
    DEBUG: bool = True
    BACKEND_URL: str = "http://localhost:8000"

    # Security
    SECRET_KEY: str = "change-me-in-production-must-be-32-chars-minimum"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    ALGORITHM: str = "HS256"

    # Database (Neon PostgreSQL)
    DATABASE_URL: str = (
        "postgresql+asyncpg://neondb_owner:npg_tK8Lj1uMOrRI"
        "@ep-long-fog-a115bxx6-pooler.ap-southeast-1.aws.neon.tech"
        "/neondb?ssl=require"
    )

    # Redis (Redis Cloud)
    REDIS_HOST: str = "redis-19406.crce283.ap-south-1-2.ec2.cloud.redislabs.com"
    REDIS_PORT: int = 19406
    REDIS_USERNAME: str = "default"
    REDIS_PASSWORD: str = "Z4midV2PdRjE7mk673MwGnXczbb7X6lg"
    REDIS_SSL: bool = False
    REDIS_QUEUE_KEY: str = "tracelify:events:queue"
    REDIS_SOCKET_CONNECT_TIMEOUT: int = 5
    REDIS_SOCKET_TIMEOUT: int = 30

    @property
    def REDIS_URL(self) -> str:  # type: ignore[override]
        """Build redis:// URL from individual fields."""
        return (
            f"redis://{self.REDIS_USERNAME}:{self.REDIS_PASSWORD}"
            f"@{self.REDIS_HOST}:{self.REDIS_PORT}"
        )

    # Google OAuth2
    GOOGLE_CLIENT_ID: str = "862188903869-30gitpalou6l9hli8eu9q4s0m2l3r8hm.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/auth/google/callback"
    GOOGLE_TOKEN_URL: str = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL: str = "https://www.googleapis.com/oauth2/v3/userinfo"
    GOOGLE_AUTH_URL: str = "https://accounts.google.com/o/oauth2/v2/auth"

    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"

    # Email Alerts
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    ALERT_FROM_EMAIL: str = "alerts@tracelify.io"


settings = Settings()
