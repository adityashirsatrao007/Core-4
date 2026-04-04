import platform
import time

def get_runtime_context():
    return {
        "os": platform.system(),
        "runtime": "python",
        "python_version": platform.python_version()
    }

def get_timestamp():
    return time.time()