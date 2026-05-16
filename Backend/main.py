# main.py

from __future__ import annotations

import os
import traceback

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import get_cors_origins
from models.errors import ErrorResponse
from services.groq_service import groq_configured
from services.ai.generation import replicate_configured

from routes import (
    brand,
    chat,
    competitor,
    content,
    design,
    growth,
    logo,
    repurpose,
    sentiment,
    social,
    suite,
    trends,
)

app = FastAPI(
    title="BizForge API",
    description="AI Branding & Growth Suite Backend",
    version="1.0.0",
)


def _error_json(
    status_code: int,
    *,
    error: str,
    code: str,
    detail: str | None = None,
) -> JSONResponse:
    body = ErrorResponse(error=error, code=code, detail=detail)
    return JSONResponse(status_code=status_code, content=body.model_dump())


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _request: Request, exc: RequestValidationError,
) -> JSONResponse:
    return _error_json(
        422,
        error="Validation failed",
        code="VALIDATION_ERROR",
        detail=str(exc.errors()),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(
    _request: Request, exc: HTTPException,
) -> JSONResponse:
    code = "HTTP_ERROR"
    if exc.status_code == 503:
        code = "AI_PROVIDER_ERROR"
    elif exc.status_code == 400:
        code = "BAD_REQUEST"
    detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    return _error_json(exc.status_code, error=detail, code=code, detail=detail)


@app.exception_handler(ValueError)
async def value_error_handler(_request: Request, exc: ValueError) -> JSONResponse:
    return _error_json(
        503,
        error=str(exc),
        code="CONFIG_ERROR",
        detail=str(exc),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    _request: Request, exc: Exception,
) -> JSONResponse:
    if os.getenv("DEBUG", "").lower() in ("1", "true", "yes"):
        detail = traceback.format_exc()
    else:
        detail = None
    return _error_json(
        500,
        error="Internal server error",
        code="INTERNAL_ERROR",
        detail=detail,
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(brand.router, prefix="/brand", tags=["Brand"])
app.include_router(logo.router, prefix="/logo", tags=["Logo"])
app.include_router(content.router, prefix="/content", tags=["Content"])
app.include_router(design.router, prefix="/design", tags=["Design"])
app.include_router(sentiment.router, prefix="/sentiment", tags=["Sentiment"])
app.include_router(trends.router, prefix="/trends", tags=["Trends"])
app.include_router(repurpose.router, prefix="/repurpose", tags=["Repurpose"])
app.include_router(growth.router, prefix="/growth", tags=["Growth"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(competitor.router, prefix="/competitor", tags=["Competitor"])
app.include_router(suite.router, prefix="/suite", tags=["Brand Suite"])
app.include_router(social.router, prefix="/social", tags=["Social"])


@app.get("/")
def root():
    return {"message": "BizForge Backend Running", "status": "OK"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "groq_configured": groq_configured(),
        "replicate_configured": replicate_configured(),
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
