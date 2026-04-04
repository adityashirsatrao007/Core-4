from tracelify.client import Tracelify

sdk = Tracelify(
    dsn="http://demo_key@localhost:8000/project/2/events",
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

print("✅ Done")