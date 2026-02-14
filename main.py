from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

APP_NAME = "Mirror API"
APP_VERSION = "1.1.0"

ECOSYSTEM_SITE = os.getenv("ECOSYSTEM_SITE", "https://a393acb1-53c8-47b1-9720-92799236d5f1.dev.coze.site/")
MIRROR_API_KEY = os.getenv("MIRROR_API_KEY")


def _split_allowed_origins(raw: str) -> list[str]:
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


ALLOWED_ORIGINS = _split_allowed_origins(
    os.getenv(
        "ALLOWED_ORIGINS",
        "https://a393acb1-53c8-47b1-9720-92799236d5f1.dev.coze.site,http://localhost:3000,http://127.0.0.1:3000",
    )
)

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="Mirror incoming HTTP requests for debugging ecosystem integrations.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

    return {
        "method": request.method,
        "path": request.url.path,
        "url": str(request.url),
        "scheme": request.url.scheme,
        "host": request.url.hostname,
        "port": request.url.port,
        "client": request.client.host if request.client else None,
        "query": dict(request.query_params),
        "path_params": dict(request.path_params),
        "headers": {k: v for k, v in request.headers.items()},
        "body_text": body_text,
        "body_json": json_body,
    }


def _verify_api_key(x_api_key: str | None) -> None:
    if not MIRROR_API_KEY:
        return
    if x_api_key != MIRROR_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid x-api-key")


@app.get("/")
async def home() -> dict[str, Any]:
    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "ecosystem_site": ECOSYSTEM_SITE,
        "docs": "/docs",
        "health": "/health",
        "mirror": "/mirror",
    }


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.api_route("/mirror", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"])
async def mirror(request: Request, x_api_key: str | None = Header(default=None)) -> JSONResponse:
    _verify_api_key(x_api_key)
    payload = await _build_mirror_payload(request)
    payload["ecosystem_site"] = ECOSYSTEM_SITE
    return JSONResponse(payload)


@app.api_route(
    "/mirror/{full_path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
)
async def mirror_with_path(
    full_path: str,
    request: Request,
    x_api_key: str | None = Header(default=None),
) -> JSONResponse:
    _verify_api_key(x_api_key)
    payload = await _build_mirror_payload(request)
    payload["mirrored_path"] = full_path
    payload["ecosystem_site"] = ECOSYSTEM_SITE
    return JSONResponse(payload)
