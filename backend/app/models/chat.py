"""
Chat model for Cloutopia platform
Handles chat sessions and message history for cloud analysis conversations
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import uuid


class ChatSession(Base):
    """Chat session model for grouping related conversations"""
    
    __tablename__ = "chat_sessions"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Unique identifier
    uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # Session metadata
    title = Column(String(200), nullable=True)  # Auto-generated or user-provided title
    description = Column(Text, nullable=True)  # Optional session description
    
    # Session status
    is_active = Column(Boolean, default=True)
    is_starred = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_activity_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign key relationships
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for anonymous sessions
    
    # Relationships
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ChatSession(id={self.id}, title='{self.title}', user='{self.user.username if self.user else 'Anonymous'}')>"


class ChatMessage(Base):
    """Individual chat message model"""
    
    __tablename__ = "chat_messages"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Unique identifier
    uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # Message content
    message = Column(Text, nullable=False)
    message_type = Column(String(20), default="user")  # user, assistant, system
    
    # AI response data
    ai_response = Column(Text, nullable=True)
    cloud_analysis_data = Column(JSON, nullable=True)  # Store full analysis results
    
    # Message metadata
    tokens_used = Column(Integer, nullable=True)  # For API usage tracking
    model_used = Column(String(50), nullable=True)  # Which AI model was used
    processing_time = Column(Integer, nullable=True)  # Time in milliseconds
    
    # Image association
    image_url = Column(String(500), nullable=True)  # Associated uploaded image
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign key relationships
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    image_id = Column(Integer, ForeignKey("images.id"), nullable=True)  # Associated image
    
    # Relationships
    session = relationship("ChatSession", back_populates="messages")
    image = relationship("Image", foreign_keys=[image_id])
    
    def __repr__(self):
        return f"<ChatMessage(id={self.id}, type='{self.message_type}', session_id={self.session_id})>"
    
    @property
    def public_data(self):
        """Return message data for public consumption"""
        return {
            "uuid": self.uuid,
            "message": self.message,
            "message_type": self.message_type,
            "ai_response": self.ai_response,
            "image_url": self.image_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "cloud_analysis": self.cloud_analysis_data
        }
