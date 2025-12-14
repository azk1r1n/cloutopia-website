"""
Configuration management for the backend application.
Loads environment variables and provides settings.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Google Gemini API
    google_gemini_api_key: str

    # Environment
    environment: str = "development"

    # Server
    port: int = 8000

    # CORS
    allowed_origins: str = "http://localhost:3000"

    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert comma-separated origins string to list."""
        return [origin.strip() for origin in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
