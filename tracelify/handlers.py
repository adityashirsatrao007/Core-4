import sys
import traceback
from .hub import get_client

def setup_global_handler():

    def handle_exception(exc_type, exc_value, exc_traceback):
        client = get_client()

        if client:
            stack = traceback.format_exception(
                exc_type, exc_value, exc_traceback
            )
            client.capture_exception(exc_value, stack)

    sys.excepthook = handle_exception