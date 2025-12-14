"""
Pydantic models for request and response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""

    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="User's message or question about clouds",
    )
    image: Optional[str] = Field(
        None,
        description="Base64-encoded image with data URI prefix (e.g., 'data:image/jpeg;base64,...')",
    )

    class Config:
        json_schema_extra = {
            "example": {
                "message": "What type of cloud is this?",
                "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
            }
        }


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""

    message: str = Field(..., description="AI-generated response")

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Based on the atmospheric patterns in your image, this appears to be a cumulus cloud formation..."
            }
        }


class ErrorResponse(BaseModel):
    """Error response model."""

    error: str = Field(..., description="Error type or message")
    detail: Optional[str] = Field(None, description="Detailed error description")

    class Config:
        json_schema_extra = {
            "example": {
                "error": "Invalid request",
                "detail": "Image data is not properly base64 encoded",
            }
        }


class StreamEvent(BaseModel):
    """Model for Server-Sent Events streaming."""

    type: str = Field(..., description="Event type: 'start', 'token', 'done', 'error'")
    content: Optional[str] = Field(None, description="Token content for 'token' events")
    message: Optional[str] = Field(None, description="Error message for 'error' events")

    class Config:
        json_schema_extra = {
            "example": {
                "type": "token",
                "content": "Based on",
            }
        }
