import threading
from .queue import event_queue
from .transport import send_event

def start_worker(config):

    def worker():
        while True:
            event = event_queue.get()
            send_event(config, event)

    thread = threading.Thread(target=worker, daemon=True)
    thread.start()