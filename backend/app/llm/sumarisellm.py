"""
Tracelify LLM Report Generator
================================
Uses AWS Bedrock (Amazon Nova Pro) to generate intelligent, structured
project health reports from live API data collected across all Tracelify
API endpoints (Auth → Orgs → Projects → Issues → Events).

Usage:
    python -m app.llm.sumarisellm
    python app/llm/sumarisellm.py
"""

import json
import uuid
import asyncio
import os
from datetime import datetime, timezone
from typing import Optional

import boto3
import httpx
from dotenv import load_dotenv

load_dotenv()

# ── Config ─────────────────────────────────────────────────────────────────────

BASE_URL = "http://localhost:8000"
TIMEOUT = 20.0

# Bedrock client (AWS Nova Pro via inference profile)
bedrock = boto3.client(
    "bedrock-runtime",
    region_name="ap-south-1",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

MODEL_ID = "arn:aws:bedrock:ap-south-1:030537971425:inference-profile/apac.amazon.nova-pro-v1:0"

# ── Colour helpers ──────────────────────────────────────────────────────────────

CYAN   = "\033[96m"
GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
RESET  = "\033[0m"

def _h(text: str) -> str:
    return f"{CYAN}{BOLD}{text}{RESET}"

def _ok(text: str) -> str:
    return f"{GREEN}✅ {text}{RESET}"

def _warn(text: str) -> str:
    return f"{YELLOW}⚠️  {text}{RESET}"

def _err(text: str) -> str:
    return f"{RED}❌ {text}{RESET}"


# ── Bedrock LLM call ────────────────────────────────────────────────────────────

def call_llm(prompt: str, temperature: float = 0.3, max_tokens: int = 2000) -> str:
    """
    Invoke Amazon Nova Pro via AWS Bedrock.
    Retries once on transient failure.
    """
    body = json.dumps({
        "messages": [
            {
                "role": "user",
                "content": [{"text": prompt}]
            }
        ],
        "inferenceConfig": {
            "maxTokens": max_tokens,
            "temperature": temperature,
        }
    })

    for attempt in range(2):
        try:
            response = bedrock.invoke_model(
                modelId=MODEL_ID,
                body=body,
                contentType="application/json",
                accept="application/json",
            )
            result = json.loads(response["body"].read())
            return result["output"]["message"]["content"][0]["text"].strip()
        except Exception as e:
            print(f"  {_warn(f'Bedrock attempt {attempt+1} failed: {e}')}")

    return "[LLM unavailable — could not generate analysis]"


# ── API data collection ─────────────────────────────────────────────────────────

async def collect_api_data(client: httpx.AsyncClient) -> dict:
    """
    Walk through all Tracelify API endpoints in order and collect live data.
    Returns a rich dict of everything discovered.
    """
    data = {
        "collected_at": datetime.now(timezone.utc).isoformat(),
        "base_url": BASE_URL,
        "health": None,
        "auth": {},
        "orgs": [],
        "projects": [],
        "issues": [],
        "events_sample": [],
        "errors": [],
    }

    # ── 1. Health check ─────────────────────────────────────────────────────────
    print(f"\n  {DIM}[1/6] Checking server health…{RESET}")
    try:
        r = await client.get(f"{BASE_URL}/health", timeout=TIMEOUT)
        data["health"] = {"status": r.status_code, "body": _safe_json(r)}
        if r.status_code == 200:
            print(f"  {_ok('Server is healthy')}")
        else:
            print(f"  {_warn(f'Health returned HTTP {r.status_code}')}")
    except Exception as e:
        data["errors"].append(f"Health check failed: {e}")
        print(f"  {_err(f'Health check failed — {e}')}")
        return data  # Cannot proceed without server

    # ── 2. Authenticate (sign up a temporary test user) ──────────────────────────
    print(f"\n  {DIM}[2/6] Authenticating…{RESET}")
    test_email = f"llm_report_{uuid.uuid4().hex[:8]}@tracelify-report.io"
    test_pass  = "Report@2024!"
    test_name  = "LLM Report Bot"

    # Try signup
    r = await client.post(f"{BASE_URL}/auth/signup", json={
        "email": test_email,
        "password": test_pass,
        "name": test_name,
    }, timeout=TIMEOUT)

    token = None
    if r.status_code == 201:
        body = _safe_json(r)
        token = body.get("access_token")
        user  = body.get("user", {})
        data["auth"] = {"user_id": user.get("id"), "email": user.get("email"), "name": user.get("name")}
        print(f"  {_ok(f'Signed up as {test_email}')}")
    else:
        # Fall back to login (user might already exist)
        r2 = await client.post(f"{BASE_URL}/auth/login", json={
            "email": test_email, "password": test_pass
        }, timeout=TIMEOUT)
        if r2.status_code == 200:
            body = _safe_json(r2)
            token = body.get("access_token")
            data["auth"] = {"email": test_email}
            print(f"  {_ok('Logged in as existing user')}")
        else:
            data["errors"].append("Auth failed — cannot collect authenticated data")
            print(f"  {_err('Authentication failed — report will be limited')}")
            return data

    headers = {"Authorization": f"Bearer {token}"}

    # GET /auth/me
    r = await client.get(f"{BASE_URL}/auth/me", headers=headers, timeout=TIMEOUT)
    if r.status_code == 200:
        me = _safe_json(r)
        data["auth"].update(me)

    # ── 3. Organizations ─────────────────────────────────────────────────────────
    print(f"\n  {DIM}[3/6] Collecting organization data…{RESET}")
    org_slug = f"report-org-{uuid.uuid4().hex[:6]}"
    r = await client.post(f"{BASE_URL}/orgs/", headers=headers, json={
        "name": "Report Test Organization",
        "slug": org_slug,
    }, timeout=TIMEOUT)

    org_id = None
    if r.status_code == 201:
        org = _safe_json(r)
        org_id = org.get("id")
        data["orgs"].append(org)
        print(f"  {_ok('Created org: ' + str(org.get('name')) + ' (id=' + str(org_id) + ')')}")

    # List all orgs
    r = await client.get(f"{BASE_URL}/orgs/", headers=headers, timeout=TIMEOUT)
    if r.status_code == 200:
        all_orgs = _safe_json(r)
        if isinstance(all_orgs, list):
            # Deduplicate
            existing_ids = {o.get("id") for o in data["orgs"]}
            for o in all_orgs:
                if o.get("id") not in existing_ids:
                    data["orgs"].append(o)
            print(f"  {_ok('Found ' + str(len(data['orgs'])) + ' org(s) total')}")

    # Members of created org
    members_info = []
    if org_id:
        r = await client.get(f"{BASE_URL}/orgs/{org_id}/members", headers=headers, timeout=TIMEOUT)
        if r.status_code == 200:
            members_info = _safe_json(r) or []

        r = await client.get(f"{BASE_URL}/orgs/{org_id}/my-role", headers=headers, timeout=TIMEOUT)
        if r.status_code == 200:
            role_info = _safe_json(r)
            data["auth"]["role_in_org"] = role_info.get("role")

    # ── 4. Projects ──────────────────────────────────────────────────────────────
    print(f"\n  {DIM}[4/6] Collecting project data…{RESET}")
    project_id  = None
    dsn_pub_key = None

    if org_id:
        proj_slug = f"report-proj-{uuid.uuid4().hex[:6]}"
        r = await client.post(f"{BASE_URL}/orgs/{org_id}/projects/", headers=headers, json={
            "name": "Report Test Project",
            "slug": proj_slug,
            "platform": "python",
        }, timeout=TIMEOUT)

        if r.status_code == 201:
            proj_with_dsn = _safe_json(r)
            project_info  = proj_with_dsn.get("project", {})
            dsn_info      = proj_with_dsn.get("dsn_key", {})
            project_id    = project_info.get("id")
            dsn_pub_key   = dsn_info.get("public_key")
            dsn_string    = dsn_info.get("dsn", "N/A")
            data["projects"].append({**project_info, "dsn": dsn_string, "dsn_key_count": 1})
            print(f"  {_ok('Created project: ' + str(project_info.get('name')) + ' | DSN ready')}")

        # List DSN keys
        if project_id:
            r = await client.get(f"{BASE_URL}/projects/{project_id}/dsn", headers=headers, timeout=TIMEOUT)
            if r.status_code == 200:
                keys = _safe_json(r) or []
                # Update dsn_key_count in project entry
                for p in data["projects"]:
                    if p.get("id") == project_id:
                        p["dsn_key_count"] = len(keys)

    # ── 5. Ingest test events ────────────────────────────────────────────────────
    print(f"\n  {DIM}[5/6] Ingesting sample events…{RESET}")

    sample_errors = [
        {"type": "ZeroDivisionError",   "message": "division by zero",       "level": "error"},
        {"type": "KeyError",            "message": "'user_id' not found",    "level": "error"},
        {"type": "ConnectionTimeout",   "message": "DB connection timed out","level": "warning"},
        {"type": "ValueError",          "message": "invalid literal for int()","level": "error"},
        {"type": "DeprecationWarning",  "message": "use new_method() instead","level": "info"},
    ]

    ingested_count = 0
    if project_id and dsn_pub_key:
        for err in sample_errors:
            payload = {
                "event_id":   str(uuid.uuid4()),
                "project_id": str(project_id),
                "timestamp":  datetime.now(timezone.utc).isoformat(),
                "level":      err["level"],
                "error": {
                    "type":       err["type"],
                    "message":    err["message"],
                    "stacktrace": f'File "app/main.py", line 42, in compute\n    result = do_{err["type"].lower()}()',
                },
                "tags":    {"version": "1.2.0", "env": "production"},
                "context": {"service": "tracelify-backend", "host": "prod-01"},
                "client":  {"sdk": "tracelify.python"},
            }
            r = await client.post(
                f"{BASE_URL}/api/{project_id}/events",
                headers={"Authorization": f"Bearer {dsn_pub_key}"},
                json=payload,
                timeout=TIMEOUT,
            )
            if r.status_code == 202:
                ingested_count += 1

        msg = 'Ingested ' + str(ingested_count) + '/' + str(len(sample_errors)) + ' events'
        print(f"  {_ok(msg)}")
        print(f"  {DIM}⏳ Waiting 4s for worker to process events…{RESET}")
        await asyncio.sleep(4)
    else:
        print(f"  {_warn('Skipping event ingest — no project or DSN key')}")

    # ── 6. Issues ─────────────────────────────────────────────────────────────────
    print(f"\n  {DIM}[6/6] Collecting issues…{RESET}")

    if project_id and token:
        # List open issues
        r = await client.get(
            f"{BASE_URL}/projects/{project_id}/issues/?status=open&limit=50",
            headers=headers, timeout=TIMEOUT,
        )
        if r.status_code == 200:
            issue_data = _safe_json(r)
            issues = issue_data.get("issues", []) if isinstance(issue_data, dict) else issue_data
            data["issues"].extend(issues[:20])  # cap at 20 for LLM
            found_msg = 'Found ' + str(len(data['issues'])) + ' open issue(s)'
            print(f"  {_ok(found_msg)}")

        # Fetch events for a sample issue
        if data["issues"]:
            sample_issue_id = data["issues"][0].get("id")
            r = await client.get(
                f"{BASE_URL}/projects/{project_id}/issues/{sample_issue_id}/events",
                headers=headers, timeout=TIMEOUT,
            )
            if r.status_code == 200:
                evts = _safe_json(r) or []
                data["events_sample"] = evts[:5]

    # Attach summary counts
    data["summary_counts"] = {
        "orgs":      len(data["orgs"]),
        "projects":  len(data["projects"]),
        "issues":    len(data["issues"]),
        "events_ingested": ingested_count,
        "error": len(issues) if "error" in str(data["issues"]) else 0,
        "warning": sum(1 for i in data["issues"] if i.get("level") == "warning"),
        "info":  sum(1 for i in data["issues"] if i.get("level") == "info"),
    }

    return data


# ── Prompt builder ──────────────────────────────────────────────────────────────

def build_report_prompt(api_data: dict) -> str:
    """
    Construct the structured prompt sent to the LLM for analysis.
    """
    counts = api_data.get("summary_counts", {})
    orgs     = api_data.get("orgs", [])
    projects = api_data.get("projects", [])
    issues   = api_data.get("issues", [])
    events   = api_data.get("events_sample", [])
    auth     = api_data.get("auth", {})
    health   = api_data.get("health", {})

    # Compact issue list for prompt
    issue_lines = []
    for i, iss in enumerate(issues[:15]):
        issue_lines.append(
            f"  {i+1}. [{iss.get('level','?').upper()}] \"{iss.get('title','(no title)')}\" "
            f"| status={iss.get('status')} | events={iss.get('event_count',0)} "
            f"| users affected={iss.get('user_count',0)} "
            f"| first_seen={iss.get('first_seen','?')} | last_seen={iss.get('last_seen','?')}"
        )
    issues_text = "\n".join(issue_lines) if issue_lines else "  No issues found."

    # Compact project list
    proj_lines = []
    for p in projects:
        proj_lines.append(
            f"  - '{p.get('name')}' (platform={p.get('platform')}, "
            f"slug={p.get('slug')}, dsn_keys={p.get('dsn_key_count',1)})"
        )
    projs_text = "\n".join(proj_lines) if proj_lines else "  No projects found."

    orgs_text = ", ".join(o.get("name", "?") for o in orgs) or "None"

    sample_event = events[0] if events else {}
    event_text   = json.dumps(sample_event, indent=2, default=str)[:600] if sample_event else "No event sample available."

    prompt = f"""You are a senior software engineering analyst generating a professional project health report for Tracelify — a Sentry-like error tracking platform.

Below is LIVE data collected from the Tracelify backend APIs right now.

=== SYSTEM STATUS ===
Backend Health: HTTP {health.get('status', 'N/A')} | Collected at: {api_data.get('collected_at')}
API Base URL: {api_data.get('base_url')}

=== AUTHENTICATED USER ===
Name: {auth.get('name', 'N/A')} | Email: {auth.get('email', 'N/A')} | Role: {auth.get('role_in_org', 'N/A')}

=== RESOURCE SUMMARY ===
- Organizations:   {counts.get('orgs', 0)}
- Projects:        {counts.get('projects', 0)}
- Open Issues:     {counts.get('issues', 0)}
- Events Ingested: {counts.get('events_ingested', 0)}

=== ORGANIZATIONS ===
{orgs_text}

=== PROJECTS ===
{projs_text}

=== OPEN ISSUES (up to 15 most recent) ===
{issues_text}

=== SAMPLE EVENT PAYLOAD ===
{event_text}

=== ERRORS DURING DATA COLLECTION ===
{chr(10).join(api_data.get('errors', [])) or 'None'}

---

Now generate a comprehensive, professional project health report. Structure it as follows:

# 🛡️ Tracelify — Project Health Report
**Generated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}

## 1. Executive Summary
Provide a 3-4 sentence overview of the system's health, overall posture, and any critical highlights.

## 2. System Status & API Health
Analyse backend reachability, authentication, and API responsiveness based on the data above.

## 3. Error Analysis & Issue Breakdown
- Categorise issues by severity (ERROR / WARNING / INFO)
- Identify the top 3 most critical issues with a brief explanation of their likely root cause
- Highlight patterns (e.g., repeated error types, high event counts)

## 4. Risk Assessment
Rate the following on a scale of Low / Medium / High / Critical:
| Risk Area              | Level | Justification |
|------------------------|-------|---------------|
| Stability              |       |               |
| Security               |       |               |
| Data Volume            |       |               |
| Monitoring Coverage    |       |               |

## 5. Actionable Recommendations
List 5 specific, prioritised recommendations for the engineering team based on the issues found.

## 6. Metrics Dashboard Snapshot
Present key metrics in a clean, structured format.

## 7. Next Steps
Suggest 3 immediate next steps with clear owners (e.g., "Backend Team", "DevOps").

Keep the tone professional but clear. Use concrete data from the report wherever possible. Do not make up information not present in the data above."""

    return prompt


# ── Report writer ──────────────────────────────────────────────────────────────

def _safe_json(resp: httpx.Response) -> dict | list:
    try:
        return resp.json()
    except Exception:
        return {"raw": resp.text}


def save_report(report_text: str, api_data: dict) -> str:
    """
    Save the Markdown + JSON report to disk and return the file path.
    """
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    report_dir = os.path.join(base_dir, "reports")
    os.makedirs(report_dir, exist_ok=True)

    md_path   = os.path.join(report_dir, f"tracelify_report_{ts}.md")
    json_path = os.path.join(report_dir, f"tracelify_report_{ts}_raw.json")

    # Markdown report
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"<!-- Generated by Tracelify LLM Report Generator on {datetime.now(timezone.utc).isoformat()} -->\n\n")
        f.write(report_text)

    # Raw JSON data snapshot
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(api_data, f, indent=2, default=str)

    return md_path, json_path


# ── Pretty console renderer ────────────────────────────────────────────────────

def render_report_to_console(report: str):
    """Print the LLM report to stdout with basic formatting."""
    print(f"\n{'═'*70}")
    print(f"{BOLD}{CYAN}  📋  TRACELIFY — LLM GENERATED PROJECT HEALTH REPORT{RESET}")
    print(f"{'═'*70}\n")

    for line in report.split("\n"):
        if line.startswith("# "):
            print(f"\n{BOLD}{CYAN}{line}{RESET}")
        elif line.startswith("## "):
            print(f"\n{BOLD}{GREEN}{line}{RESET}")
        elif line.startswith("### "):
            print(f"\n{BOLD}{YELLOW}{line}{RESET}")
        elif line.startswith(("- ", "* ", "1.", "2.", "3.", "4.", "5.")):
            print(f"  {line}")
        elif "|" in line and line.strip().startswith("|"):
            print(f"  {DIM}{line}{RESET}")
        elif line.startswith("**") and line.endswith("**"):
            print(f"{BOLD}{line}{RESET}")
        else:
            print(line)

    print(f"\n{'═'*70}\n")


# ── Main entry point ───────────────────────────────────────────────────────────

async def main():
    print(f"\n{'═'*70}")
    print(f"{BOLD}{CYAN}  🤖  Tracelify LLM Report Generator{RESET}")
    print(f"  Powered by  : Amazon Nova Pro (AWS Bedrock)")
    print(f"  Target API  : {BASE_URL}")
    print(f"  Started at  : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'═'*70}")

    # ── Step 1: Check server ──────────────────────────────────────────────────
    print(f"\n{_h('Phase 1 — Collecting Live API Data')}")
    async with httpx.AsyncClient() as client:
        api_data = await collect_api_data(client)

    if api_data.get("health", {}).get("status") != 200:
        print(f"\n{_err('Backend is not reachable. Start the server and retry.')}")
        print(f"  Run:  uvicorn main:app --reload  (from the backend/ directory)\n")
        return

    # ── Step 2: Generate LLM report ───────────────────────────────────────────
    print(f"\n{_h('Phase 2 — Generating AI Analysis via Amazon Nova Pro')}")
    print(f"  {DIM}Building prompt from {len(api_data.get('issues', []))} issues, "
          f"{len(api_data.get('projects', []))} projects…{RESET}")

    prompt = build_report_prompt(api_data)
    print(f"  {DIM}Prompt size: ~{len(prompt)} characters | Sending to Bedrock…{RESET}")

    report = call_llm(prompt, temperature=0.3, max_tokens=2000)

    if not report or report.startswith("[LLM unavailable"):
        print(f"\n{_warn('LLM call failed. Showing raw API data instead.')}")
        print(json.dumps(api_data, indent=2, default=str))
        return

    # ── Step 3: Display + Save ────────────────────────────────────────────────
    render_report_to_console(report)

    print(_h("Phase 3 — Saving Report"))
    md_path, json_path = save_report(report, api_data)
    print("  " + _ok("Markdown report \u2192 " + md_path))
    print("  " + _ok("Raw JSON data   \u2192 " + json_path))
    print()


if __name__ == "__main__":
    asyncio.run(main())