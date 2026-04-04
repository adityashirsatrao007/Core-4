from tracelify.client import Tracelify

# ─────────────────────────────────────────────────────────────────────────────
# DSN format: http://<public_key>@localhost:8000/api/<project_uuid>/events
#
# To get your real DSN run:
#   python3 get_dsn.py <your_email> <your_password>
#
# Then paste the "Full DSN" value below.
# ─────────────────────────────────────────────────────────────────────────────

sdk = Tracelify(
    dsn="http://28ebebe34a006d9d0d1562416c8040de@localhost:8000/api/89433c10-b28a-4516-bfbb-5011f5ef7208/events",
    release="1.0.0"
)

sdk.set_user({"id": "user_101"})
sdk.set_tag("env", "Production")

sdk.add_breadcrumb("App started")
sdk.add_breadcrumb("User clicked button")

try:
    x = 10 / 0
except Exception as e:
    sdk.capture_exception(e)

# IMPORTANT: flush() waits for the background worker to send the event
# before the script exits — without this, events may be dropped.
sdk.flush(timeout=10)

print("✅ Done")