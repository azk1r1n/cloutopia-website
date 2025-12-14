"""
Cloutopia Backend API
FastAPI application with Google Gemini integration for cloud recognition.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.config import settings
from app.routers import chat

# Create FastAPI application with request size limits
app = FastAPI(
    title="Cloutopia API",
    description="Cloud recognition and analysis API powered by Google Gemini",
    version="1.0.0",
)

# Middleware to limit request body size (15MB max to account for base64 overhead)
@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    """Limit request body size to prevent memory exhaustion."""
    max_size = 15 * 1024 * 1024  # 15MB (accounts for ~10MB image after base64 decode)

    # Only check POST requests
    if request.method == "POST":
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > max_size:
            return JSONResponse(
                status_code=413,
                content={
                    "detail": f"Request body too large. Maximum size: {max_size / (1024*1024):.0f}MB"
                },
            )

    response = await call_next(request)
    return response

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])


@app.get("/health")
async def health_check():
    """Health check endpoint to verify the API is running."""
    return {
        "status": "healthy",
        "service": "cloutopia-backend",
        "version": "1.0.0",
    }


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Cloutopia API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=True if settings.environment == "development" else False,
    )
