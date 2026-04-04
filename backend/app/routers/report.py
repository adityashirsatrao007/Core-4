"""
LLM Report Router — POST /report/generate
==========================================
Triggers the full LLM-powered project health report via the API.
Requires authentication (Bearer token).
"""
import asyncio
import os
from datetime import datetime, timezone
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel
import httpx

from app.core.deps import CurrentUser
from app.llm.sumarisellm import collect_api_data, build_report_prompt, call_llm, save_report

router = APIRouter(prefix="/report", tags=["LLM Report"])


class ReportResponse(BaseModel):
    status: str
    message: str
    report_preview: str
    full_report: str
    markdown_path: str
    json_path: str
    generated_at: str
    issue_count: int
    project_count: int


@router.post(
    "/generate",
    response_model=ReportResponse,
    summary="Generate an AI-powered project health report using live API data",
)
async def generate_report(current_user: CurrentUser):
    """
    Collects live data from all Tracelify API endpoints, sends it to
    Amazon Nova Pro (AWS Bedrock), and returns a structured Markdown report.

    This is a synchronous endpoint — the report is generated before responding.
    Typical response time: 15–30 seconds.
    """
    base_url = os.getenv("BACKEND_URL", "http://localhost:8000")

    async with httpx.AsyncClient() as client:
        api_data = await collect_api_data(client)

    if not api_data.get("health") or api_data["health"].get("status") != 200:
        raise HTTPException(status_code=503, detail="Backend health check failed during report generation")

    prompt = build_report_prompt(api_data)
    report = call_llm(prompt, temperature=0.3, max_tokens=2000)

    if not report or report.startswith("[LLM unavailable"):
        raise HTTPException(status_code=502, detail="LLM service (AWS Bedrock) did not respond. Check AWS credentials.")

    md_path, json_path = save_report(report, api_data)

    # Preview: first 800 chars
    preview = report[:800] + ("…" if len(report) > 800 else "")

    return ReportResponse(
        status="success",
        message="Report generated successfully via Amazon Nova Pro",
        report_preview=preview,
        full_report=report,
        markdown_path=md_path,
        json_path=json_path,
        generated_at=datetime.now(timezone.utc).isoformat(),
        issue_count=len(api_data.get("issues", [])),
        project_count=len(api_data.get("projects", [])),
    )


@router.get(
    "/health",
    summary="Check if the LLM report service is configured",
)
async def report_health():
    """Quick check that AWS credentials are set."""
    has_key  = bool(os.getenv("AWS_ACCESS_KEY_ID"))
    has_sec  = bool(os.getenv("AWS_SECRET_ACCESS_KEY"))
    return {
        "status": "ready" if (has_key and has_sec) else "unconfigured",
        "aws_key_set":    has_key,
        "aws_secret_set": has_sec,
        "model": "apac.amazon.nova-pro-v1:0",
        "region": "ap-south-1",
    }
