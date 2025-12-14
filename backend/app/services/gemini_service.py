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


def prepare_image_from_base64(base64_string: str) -> Image.Image:
    """
    Convert base64-encoded image string to PIL Image.

    Args:
        base64_string: Base64 string with or without data URI prefix

    Returns:
        PIL.Image.Image: Decoded PIL Image object

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

        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes))

        return image

    except Exception as e:
        raise ValueError(f"Failed to decode base64 image: {str(e)}")


async def stream_gemini_response(
    model: genai.GenerativeModel,
    message: str,
    image_data: Optional[str] = None,
) -> AsyncGenerator[str, None]:
    """
    Stream AI response from Gemini API.

    Args:
        model: Initialized Gemini model
        message: User's text message
        image_data: Optional base64-encoded image

    Yields:
        str: Tokens/chunks of the AI response

    Raises:
        Exception: If Gemini API call fails
    """
    try:
        # Prepare the prompt
        prompt_parts = []

        # Add image if provided
        if image_data:
            image = prepare_image_from_base64(image_data)
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

        # Stream the response chunks
        for chunk in response:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        error_message = str(e)
        # Sanitize error message for user display
        if "API_KEY" in error_message.upper():
            raise Exception("API key error. Please check your Gemini API configuration.")
        elif "QUOTA" in error_message.upper() or "RATE" in error_message.upper():
            raise Exception("API rate limit exceeded. Please try again in a moment.")
        else:
            raise Exception(f"Failed to generate response: {error_message}")


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
    model = initialize_gemini()

    try:
        # Prepare the prompt
        prompt_parts = []

        # Add image if provided
        if image_data:
            image = prepare_image_from_base64(image_data)
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
