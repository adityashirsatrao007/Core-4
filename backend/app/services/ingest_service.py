"""
Event ingest service:
 1. Validate DSN (public_key + project_id)
 2. Serialize event to JSON
 3. Push to Redis queue
"""
import json
import uuid
from typing import Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.project import DsnKey
from app.schemas.event import IngestEventRequest
from app.core.redis import push_to_queue
from loguru import logger


async def validate_dsn(
    db: AsyncSession,
    public_key: str,
    project_id: str,
) -> "SimpleNamespace":
    """
    Verify that:
      - public_key exists in dsn_keys and is_active=True
      - The key belongs to the given project_id
    Returns a lightweight object with .id on success, raises 401/404 on failure.
    """
    from types import SimpleNamespace

    result = await db.execute(
        select(DsnKey).where(
            DsnKey.public_key == public_key,
            DsnKey.is_active == True,  # noqa: E712
        )
    )
    key = result.scalar_one_or_none()

    if key is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive DSN key",
        )

    # Verify project_id matches
    try:
        pid = uuid.UUID(project_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project_id format",
        )

    if key.project_id != pid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="DSN key does not belong to this project",
        )

    # Return lightweight object — no second DB query needed (enqueue only uses .id)
    return SimpleNamespace(id=pid)


async def enqueue_event(
    project: Any,
    event: IngestEventRequest,
    public_key: str,
) -> str:
    """
    Serialize the validated event and push it to the Redis queue.
    Returns the event_id.
    """
    payload = {
        "event_id": event.event_id,
        "project_id": str(project.id),
        "public_key": public_key,
        "level": event.level,
        "release": event.release,
        "environment": "production",   # SDK doesn't pass env yet; default here
        "fingerprint": event.fingerprint,
        "timestamp": event.timestamp,
        "error": event.error.model_dump() if event.error else None,
        "context": event.context or {},
        "tags": event.tags or {},
        "user_info": event.user or {},
        "breadcrumbs": event.breadcrumbs or [],
        "sdk_name": event.client.sdk if event.client else "tracelify.python",
    }

    await push_to_queue(json.dumps(payload))
    logger.info(f"📥 Event {event.event_id} queued for project {project.id}")
    return event.event_id
