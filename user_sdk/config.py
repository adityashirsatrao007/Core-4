from urllib.parse import urlparse

class Config:
    def __init__(self, dsn, release):
        parsed = urlparse(dsn)

        self.protocol = parsed.scheme
        self.host = parsed.hostname
        self.port = parsed.port or 8000
        self.public_key = parsed.username or "demo_key"

        path_parts = parsed.path.strip("/").split("/")
        self.project_id = path_parts[1] if len(path_parts) > 1 else "1"
        self.release = release

    def get_endpoint(self):
        return f"{self.protocol}://{self.host}:{self.port}/events"