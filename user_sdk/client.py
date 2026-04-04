from .config import Config
from .hub import set_client
from .scope import Scope
from .queue import event_queue
from .worker import start_worker
from .handlers import setup_global_handler
from .utils import get_runtime_context, get_timestamp
import traceback


class Tracelify:

    def __init__(self, dsn):
        self.config = Config(dsn)
        self.scope = Scope()

        # register global client
        set_client(self)

        # start background worker
        start_worker(self.config)

        # enable auto error capture
        setup_global_handler()

    def capture_exception(self, error, stacktrace=None):

        if stacktrace is None:
            tb = getattr(error, "__traceback__", None)
            if tb is not None:
                stacktrace = traceback.format_exception(type(error), error, tb)
            else:
                stacktrace = []

        event = {
            "project_id": self.config.project_id,
            "timestamp": get_timestamp(),
            "error": {
                "type": type(error).__name__,
                "message": str(error),
                "stacktrace": stacktrace
            },
            "context": get_runtime_context(),
            **self.scope.get()
        }

        event_queue.put(event)

    # -------- USER METHODS --------

    def set_user(self, user):
        self.scope.set_user(user)

    def set_tag(self, key, value):
        self.scope.set_tag(key, value)

    def add_breadcrumb(self, message):
        self.scope.add_breadcrumb(message)