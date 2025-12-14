"""
Cloutopia Backend API
FastAPI application with Google Gemini integration for cloud recognition.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import chat

# Create FastAPI application
app = FastAPI(
    title="Cloutopia API",
    description="Cloud recognition and analysis API powered by Google Gemini",
    version="1.0.0",
)

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
