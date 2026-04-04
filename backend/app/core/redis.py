import redis.asyncio as aioredis
from redis.exceptions import TimeoutError as RedisTimeoutError
from app.core.config import settings
from loguru import logger
from typing import Optional

_redis_pool: Optional[aioredis.Redis] = None


async def get_redis_pool() -> aioredis.Redis:
    """Return (or create) the shared Redis connection pool."""
    global _redis_pool

    if _redis_pool is None:
        # Use explicit params for Redis Cloud (ACL username + password)
        _redis_pool = aioredis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            username=settings.REDIS_USERNAME,
            password=settings.REDIS_PASSWORD,
            ssl=settings.REDIS_SSL,
            decode_responses=True,
            max_connections=20,
            socket_connect_timeout=settings.REDIS_SOCKET_CONNECT_TIMEOUT,
            socket_timeout=settings.REDIS_SOCKET_TIMEOUT,
            retry_on_timeout=True,
        )
        # Verify connection on first creation
        try:
            await _redis_pool.ping()
            logger.info(
                f"✅ Redis connected → {settings.REDIS_HOST}:{settings.REDIS_PORT}"
            )
        except Exception as exc:
            logger.error(f"❌ Redis connection failed: {exc}")
            _redis_pool = None
            raise

    return _redis_pool


async def close_redis_pool() -> None:
    """Close the Redis connection pool on shutdown."""
    global _redis_pool
    if _redis_pool:
        await _redis_pool.aclose()
        _redis_pool = None
        logger.info("🔌 Redis pool closed")


async def push_to_queue(data: str) -> None:
    """Push a JSON string to the Redis event queue (RPUSH)."""
    pool = await get_redis_pool()
    await pool.rpush(settings.REDIS_QUEUE_KEY, data)


async def pop_from_queue(timeout: int = 5) -> Optional[str]:
    """
    Block-pop from the Redis event queue (BLPOP).
    Returns the raw JSON string or None on timeout.
    """
    pool = await get_redis_pool()
    try:
        result = await pool.blpop(settings.REDIS_QUEUE_KEY, timeout=timeout)
    except RedisTimeoutError:
        # Treat read timeout as an idle poll so the worker can continue quietly.
        return None
    if result:
        _, value = result
        return value
    return None
