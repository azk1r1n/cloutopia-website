"""
Google Gemini API integration service.
Handles cloud recognition, image analysis, and streaming responses.
"""

import base64
import io
import re
from typing import AsyncGenerator, Optional

import google.generativeai as genai
from PIL import Image

from app.config import settings

# System prompt for Cloutopia AI
SYSTEM_PROMPT = """You are Cloutopia AI, an expert meteorologist and atmospheric scientist specializing in cloud identification and geographic analysis based on atmospheric patterns.

When analyzing cloud images:
1. Identify cloud types (cumulus, stratus, cirrus, nimbus, cumulonimbus, stratocumulus, etc.)
2. Describe atmospheric conditions visible in the image
3. Make educated guesses about the photo location based on:
   - Cloud formations typical to certain climates (temperate, tropical, subtropical, continental, maritime, etc.)
   - Lighting conditions and sun angle
   - Vegetation or landscape visible (if any)
   - Weather patterns and atmospheric moisture levels
   - Time of day estimates based on lighting

Provide detailed, engaging explanations. Be conversational and educational. If the user uploads an image, analyze it thoroughly. If they ask a question without an image, help them understand cloud formations and atmospheric phenomena.

Always be enthusiastic about clouds and weather patterns!"""


def initialize_gemini() -> genai.GenerativeModel:
    """
    Initialize and configure Google Gemini API.

    Returns:
        genai.GenerativeModel: Configured Gemini model instance

    Raises:
        ValueError: If API key is not configured
    """
    if not settings.google_gemini_api_key or settings.google_gemini_api_key == "your_gemini_api_key_here":
        raise ValueError(
            "Google Gemini API key is not configured. Please set GOOGLE_GEMINI_API_KEY in .env file."
        )

    # Configure the Gemini API
    genai.configure(api_key=settings.google_gemini_api_key)

    # Use gemini-1.5-flash for fast responses with vision support
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash", # gemini-2.5-flash-preview-09-2025, gemini-2.5-flash-lite, gemini-2.5-flash-lite-preview-09-2025, gemini-2.0-flash, gemini-2.0-flash-lite
        system_instruction=SYSTEM_PROMPT,
    )

    return model


def prepare_image_from_base64(base64_string: str, max_size: int = 1024) -> Image.Image:
    """
    Convert base64-encoded image string to PIL Image with size optimization.

    Args:
        base64_string: Base64 string with or without data URI prefix
        max_size: Maximum dimension (width or height) in pixels. Default 1024.

    Returns:
        PIL.Image.Image: Decoded and optimized PIL Image object

    Raises:
        ValueError: If base64 string is invalid or cannot be decoded
    """
    try:
        # Remove data URI prefix if present (e.g., "data:image/jpeg;base64,")
        if base64_string.startswith("data:"):
            # Extract base64 data after the comma
            base64_data = base64_string.split(",", 1)[1]
        else:
            base64_data = base64_string

        # Decode base64 to bytes
        image_bytes = base64.b64decode(base64_data)

        # Check size limit (10MB max for base64 data)
        max_bytes = 10 * 1024 * 1024  # 10MB
        if len(image_bytes) > max_bytes:
            raise ValueError(f"Image too large: {len(image_bytes)} bytes (max: {max_bytes})")

        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes))

        # Resize if image is too large (saves memory)
        # Gemini doesn't need full resolution for cloud analysis
        if image.width > max_size or image.height > max_size:
            # Calculate new size maintaining aspect ratio
            ratio = min(max_size / image.width, max_size / image.height)
            new_size = (int(image.width * ratio), int(image.height * ratio))
            image = image.resize(new_size, Image.Resampling.LANCZOS)

        # Convert to RGB if necessary (removes alpha channel, saves memory)
        if image.mode not in ('RGB', 'L'):
            image = image.convert('RGB')

        return image

    except Exception as e:
        raise ValueError(f"Failed to decode base64 image: {str(e)}")


async def stream_gemini_response(
    model: genai.GenerativeModel,
    message: str,
    image_data: Optional[str] = None,
) -> AsyncGenerator[str, None]:
    """
    Stream AI response from Gemini API word-by-word for gradual display.

    Args:
        model: Initialized Gemini model
        message: User's text message
        image_data: Optional base64-encoded image

    Yields:
        str: Individual words of the AI response

    Raises:
        Exception: If Gemini API call fails
    """
    import asyncio
    import gc

    image = None  # Initialize to None for cleanup
    try:
        # Prepare the prompt
        prompt_parts = []

        # Add image if provided (resized to save memory)
        if image_data:
            image = prepare_image_from_base64(image_data, max_size=1024)
            prompt_parts.append(image)

        # Add user message
        prompt_parts.append(message)

        # Generate streaming response
        response = model.generate_content(
            prompt_parts,
            stream=True,
            generation_config=genai.GenerationConfig(
                temperature=0.7,
                top_p=0.95,
                top_k=40,
                max_output_tokens=2048,
            ),
        )

        # Clear image from memory after sending to API
        if image:
            prompt_parts.clear()  # Remove references
            image = None
            gc.collect()  # Suggest garbage collection

        # Stream the response chunks word-by-word for smooth display
        for chunk in response:
            if chunk.text:
                # Split chunk into words while preserving spaces and newlines
                words = re.split(r'(\s+)', chunk.text)

                for word in words:
                    if word:  # Skip empty strings
                        yield word
                        # Small delay for smoother visual effect (optional)
                        await asyncio.sleep(0.01)

    except Exception as e:
        error_message = str(e)
        # Sanitize error message for user display
        if "API_KEY" in error_message.upper():
            raise Exception("API key error. Please check your Gemini API configuration.")
        elif "QUOTA" in error_message.upper() or "RATE" in error_message.upper():
            raise Exception("API rate limit exceeded. Please try again in a moment.")
        else:
            raise Exception(f"Failed to generate response: {error_message}")
    finally:
        # Ensure cleanup even if error occurs
        if image:
            image = None
        gc.collect()


async def generate_complete_response(
    message: str,
    image_data: Optional[str] = None,
) -> str:
    """
    Generate a complete (non-streaming) response from Gemini.

    Args:
        message: User's text message
        image_data: Optional base64-encoded image

    Returns:
        str: Complete AI response

    Raises:
        Exception: If Gemini API call fails
    """
    import gc

    model = initialize_gemini()
    image = None

    try:
        # Prepare the prompt
        prompt_parts = []

        # Add image if provided (resized to save memory)
        if image_data:
            image = prepare_image_from_base64(image_data, max_size=1024)
            prompt_parts.append(image)

        # Add user message
        prompt_parts.append(message)

        # Generate response (non-streaming)
        response = model.generate_content(
            prompt_parts,
            generation_config=genai.GenerationConfig(
                temperature=0.7,
                top_p=0.95,
                top_k=40,
                max_output_tokens=2048,
            ),
        )

        # Clear image from memory after getting response
        if image:
            prompt_parts.clear()
            image = None
            gc.collect()

        return response.text

    except Exception as e:
        error_message = str(e)
        # Sanitize error message for user display
        if "API_KEY" in error_message.upper():
            raise Exception("API key error. Please check your Gemini API configuration.")
        elif "QUOTA" in error_message.upper() or "RATE" in error_message.upper():
            raise Exception("API rate limit exceeded. Please try again in a moment.")
        else:
            raise Exception(f"Failed to generate response: {error_message}")
    finally:
        # Ensure cleanup
        if image:
            image = None
        gc.collect()
