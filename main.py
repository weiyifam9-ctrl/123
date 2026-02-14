from __future__ import annotations

from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI(
    title="Mirror API",
    version="1.0.0",
    description="Return request details back to caller for debugging/integration tests.",
)


async def _build_mirror_payload(request: Request) -> dict[str, Any]:
    body_bytes = await request.body()
    body_text = body_bytes.decode("utf-8", errors="replace")

    json_body: Any | None = None
    if body_bytes:
        try:
            json_body = await request.json()
        except Exception:
            json_body = None

    query_params = dict(request.query_params)
    path_params = dict(request.path_params)
    headers = {k: v for k, v in request.headers.items()}

    return {
        "method": request.method,
        "path": request.url.path,
        "url": str(request.url),
        "scheme": request.url.scheme,
        "host": request.url.hostname,
        "port": request.url.port,
        "client": request.client.host if request.client else None,
        "query": query_params,
        "path_params": path_params,
        "headers": headers,
        "body_text": body_text,
        "body_json": json_body,
    }


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.api_route("/mirror", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"])
async def mirror(request: Request) -> JSONResponse:
    payload = await _build_mirror_payload(request)
    return JSONResponse(payload)


@app.api_route(
    "/mirror/{full_path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
)
async def mirror_with_path(full_path: str, request: Request) -> JSONResponse:
    payload = await _build_mirror_payload(request)
    payload["mirrored_path"] = full_path
    return JSONResponse(payload)
