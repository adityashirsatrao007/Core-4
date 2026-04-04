from urllib.parse import urlparse


class Config:
    def __init__(self, dsn, release):
        """
        Parse DSN format: http://<public_key>@<host>:<port>/api/<project_id>/events
        Example: http://abc123@localhost:8000/api/550e8400-e29b.../events
        """
        parsed = urlparse(dsn)

        self.protocol = parsed.scheme
        self.host = parsed.hostname
        self.port = parsed.port or 8000
        self.public_key = parsed.username or "demo_key"

        # Path: /api/<project_id>/events → parts: ['api', '<project_id>', 'events']
        path_parts = parsed.path.strip("/").split("/")
        if len(path_parts) >= 2 and path_parts[0] in ("api", "project"):
            self.project_id = path_parts[1]
        elif len(path_parts) >= 1:
            self.project_id = path_parts[0]
        else:
            self.project_id = "unknown"

        self.release = release

    def get_endpoint(self) -> str:
        """Returns the full ingest URL for this project."""
        base = f"{self.protocol}://{self.host}:{self.port}"
        return f"{base}/api/{self.project_id}/events"

    def get_headers(self) -> dict:
        """Returns auth headers to send with every event."""
        return {
            "Authorization": f"Bearer {self.public_key}",
            "Content-Type": "application/json",
        }