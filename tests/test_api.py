from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


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
