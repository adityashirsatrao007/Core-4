import requests

def send_event(config, data):
    try:
        print("🚀 Sending event:", data)
        requests.post(
            config.get_endpoint(),
            json=data,
            headers={
                "Authorization": config.public_key,
                "X-Project-ID": str(config.project_id)
            },
            timeout=3
        )
    except Exception:
        pass