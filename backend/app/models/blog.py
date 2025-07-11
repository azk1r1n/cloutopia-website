"""
Blog model for Cloutopia platform
Handles blog posts generated from cloud analysis and user interactions
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import uuid


class Blog(Base):
    """Blog model for storing cloud analysis blog posts"""
    
    __tablename__ = "blogs"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Unique identifier for public URLs
    uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # Content fields
    title = Column(String(200), nullable=False, index=True)
    slug = Column(String(250), unique=True, index=True, nullable=False)  # URL-friendly version of title
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)  # Short summary/preview
    
    # Metadata
    tags = Column(JSON, default=list)  # List of tags as JSON array
    category = Column(String(50), default="cloud-analysis")
    
    # Publishing status
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    
    # SEO and social
    meta_description = Column(String(160), nullable=True)
    og_image_url = Column(String(500), nullable=True)  # Open Graph image for social sharing
    
    # Analytics
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Foreign key relationships
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    featured_image_id = Column(Integer, ForeignKey("images.id"), nullable=True)
    
    # AI-generated content metadata
    ai_analysis_data = Column(JSON, nullable=True)  # Store the original AI analysis
    generation_prompt = Column(Text, nullable=True)  # Store the prompt used to generate content
    
    # Relationships
    author = relationship("User", back_populates="blogs")
    featured_image = relationship("Image", foreign_keys=[featured_image_id])
    
    def __repr__(self):
        return f"<Blog(id={self.id}, title='{self.title}', author='{self.author.username if self.author else 'Unknown'}')>"
    
    @property
    def public_data(self):
        """Return blog data for public consumption"""
        return {
            "uuid": self.uuid,
            "title": self.title,
            "slug": self.slug,
            "content": self.content,
            "excerpt": self.excerpt,
            "tags": self.tags,
            "category": self.category,
            "is_featured": self.is_featured,
            "meta_description": self.meta_description,
            "og_image_url": self.og_image_url,
            "view_count": self.view_count,
            "like_count": self.like_count,
            "created_at": self.created_at,
            "published_at": self.published_at,
            "author": self.author.public_data if self.author else None,
            "featured_image": self.featured_image.public_data if self.featured_image else None
        }
    
    @property
    def admin_data(self):
        """Return blog data for admin/author management"""
        return {
            "id": self.id,
            "uuid": self.uuid,
            "title": self.title,
            "slug": self.slug,
            "content": self.content,
            "excerpt": self.excerpt,
            "tags": self.tags,
            "category": self.category,
            "is_published": self.is_published,
            "is_featured": self.is_featured,
            "meta_description": self.meta_description,
            "og_image_url": self.og_image_url,
            "view_count": self.view_count,
            "like_count": self.like_count,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "published_at": self.published_at,
            "author_id": self.author_id,
            "featured_image_id": self.featured_image_id,
            "ai_analysis_data": self.ai_analysis_data,
            "generation_prompt": self.generation_prompt
        }
    
    def increment_view_count(self):
        """Increment the view count for this blog post"""
        self.view_count += 1
    
    def increment_like_count(self):
        """Increment the like count for this blog post"""
        self.like_count += 1
