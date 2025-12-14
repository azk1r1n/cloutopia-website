"""
Chat router for Gemini AI streaming endpoints.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models import ChatRequest, ChatResponse, ErrorResponse
from app.services.gemini_service import initialize_gemini, stream_gemini_response
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


async def generate_sse_stream(chat_request: ChatRequest):
    """
    Generate Server-Sent Events stream for AI response.

    Args:
        chat_request: ChatRequest with message and optional image

    Yields:
        Formatted SSE events
    """
    try:
        # Initialize Gemini model
        model = initialize_gemini()

        # Send start event
        yield f"data: {json.dumps({'type': 'start'})}\n\n"

        # Stream response tokens
        async for token in stream_gemini_response(
            model=model,
            message=chat_request.message,
            image_data=chat_request.image,
        ):
            # Send each token as an SSE event
            event_data = {"type": "token", "content": token}
            yield f"data: {json.dumps(event_data)}\n\n"

        # Send done event
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except ValueError as e:
        # Validation or configuration errors
        logger.error(f"Validation error: {str(e)}")
        error_data = {"type": "error", "message": str(e)}
        yield f"data: {json.dumps(error_data)}\n\n"

    except Exception as e:
        # Other errors (API failures, etc.)
        logger.error(f"Streaming error: {str(e)}")
        error_data = {"type": "error", "message": "An error occurred while generating response"}
        yield f"data: {json.dumps(error_data)}\n\n"


@router.post(
    "/chat/stream",
    response_class=StreamingResponse,
    summary="Stream AI chat response",
    description="Stream AI-generated response using Server-Sent Events (SSE)",
)
async def stream_chat(chat_request: ChatRequest):
    """
    Stream AI response for cloud analysis.

    Args:
        chat_request: ChatRequest with user message and optional image

    Returns:
        StreamingResponse with SSE events

    SSE Event Format:
        - start: {"type": "start"}
        - token: {"type": "token", "content": "text"}
        - done: {"type": "done"}
        - error: {"type": "error", "message": "error text"}
    """
    logger.info(f"Streaming chat request: {chat_request.message[:50]}...")

    return StreamingResponse(
        generate_sse_stream(chat_request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        },
    )


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Get complete AI chat response",
    description="Get complete AI response (non-streaming)",
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request"},
        500: {"model": ErrorResponse, "description": "Server error"},
    },
)
async def chat(chat_request: ChatRequest):
    """
    Get complete AI response for cloud analysis (non-streaming).

    Args:
        chat_request: ChatRequest with user message and optional image

    Returns:
        ChatResponse with complete AI message

    Raises:
        HTTPException: If request is invalid or API fails
    """
    logger.info(f"Non-streaming chat request: {chat_request.message[:50]}...")

    try:
        from app.services.gemini_service import generate_complete_response

        response_text = await generate_complete_response(
            message=chat_request.message,
            image_data=chat_request.image,
        )

        return ChatResponse(message=response_text)

    except ValueError as e:
        # Validation errors (bad base64, etc.)
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        # API errors or other failures
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate response. Please try again.",
        )
