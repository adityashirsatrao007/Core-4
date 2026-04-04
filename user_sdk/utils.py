import platform
import time
from datetime import datetime, timezone

def get_runtime_context():
    return {
        "os": platform.system(),
        "runtime": "python",
        "python_version": platform.python_version()
    }

def get_timestamp():
    return datetime.now(timezone.utc).isoformat()