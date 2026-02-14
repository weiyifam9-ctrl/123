import os

from fastapi.testclient import TestClient

# Ensure deterministic env before importing app
os.environ.setdefault("ECOSYSTEM_SITE", "https://a393acb1-53c8-47b1-9720-92799236d5f1.dev.coze.site/")
os.environ.setdefault("ALLOWED_ORIGINS", "https://a393acb1-53c8-47b1-9720-92799236d5f1.dev.coze.site")
os.environ.pop("MIRROR_API_KEY", None)

from main import app

client = TestClient(app)


def test_home() -> None:
    res = client.get("/")
    assert res.status_code == 200
    body = res.json()
    assert body["name"] == "Mirror API"
    assert body["mirror"] == "/mirror"


def test_health() -> None:
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_mirror_json_body() -> None:
    payload = {"hello": "world"}
    res = client.post(
        "/mirror/sample?x=1",
        headers={"X-Test": "yes"},
        json=payload,
    )
    assert res.status_code == 200
    body = res.json()
    assert body["method"] == "POST"
    assert body["query"] == {"x": "1"}
    assert body["body_json"] == payload
    assert body["mirrored_path"] == "sample"
    assert body["headers"]["x-test"] == "yes"
