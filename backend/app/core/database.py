from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from app.core.config import settings
from loguru import logger


# ── Engine ────────────────────────────────────────────────────────────────────
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={
        "ssl": "require",
        "statement_cache_size": 0,      # required for PgBouncer (Neon pooler)
        "prepared_statement_cache_size": 0,
    },
)

# ── Session Factory ───────────────────────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# ── Base ──────────────────────────────────────────────────────────────────────
class Base(DeclarativeBase):
    pass


# ── Lifecycle helpers ─────────────────────────────────────────────────────────
async def init_db() -> None:
    """Create all tables if they don't exist (dev only). Use Alembic in prod."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ Database tables initialised")


async def check_db_connection() -> bool:
    """Ping the database."""
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        logger.error(f"❌ DB connection failed: {exc}")
        return False


async def get_db() -> AsyncSession:
    """Dependency — yields an async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
