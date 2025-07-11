"""
Image model for Cloutopia platform
Handles cloud images, their metadata, and AI analysis results
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base
import uuid


class Image(Base):
    """Image model for storing cloud images and analysis data"""
    
    __tablename__ = "images"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Unique identifier
    uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # File information
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)  # User's original filename
    file_path = Column(String(500), nullable=False)  # Path to stored file
    file_size = Column(Integer, nullable=False)  # Size in bytes
    mime_type = Column(String(100), nullable=False)  # e.g., "image/jpeg"
    
    # Image metadata
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    format = Column(String(20), nullable=True)  # JPEG, PNG, etc.
    
    # Cloud analysis results
    cloud_types = Column(JSON, default=list)  # List of identified cloud types
    weather_prediction = Column(JSON, nullable=True)  # Weather forecast data
    location_analysis = Column(JSON, nullable=True)  # Location estimation data
    confidence_scores = Column(JSON, nullable=True)  # Confidence scores for various analyses
    
    # Analysis metadata
    analysis_status = Column(String(20), default="pending")  # pending, processing, completed, failed
    analysis_started_at = Column(DateTime(timezone=True), nullable=True)
    analysis_completed_at = Column(DateTime(timezone=True), nullable=True)
    analysis_error = Column(Text, nullable=True)  # Error message if analysis failed
    
    # Geographic data (if available)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    altitude = Column(Float, nullable=True)
    location_name = Column(String(200), nullable=True)
    
    # EXIF and camera data
    camera_make = Column(String(100), nullable=True)
    camera_model = Column(String(100), nullable=True)
    taken_at = Column(DateTime(timezone=True), nullable=True)  # When photo was taken
    iso = Column(Integer, nullable=True)
    aperture = Column(String(10), nullable=True)
    shutter_speed = Column(String(20), nullable=True)
    focal_length = Column(String(20), nullable=True)
    
    # Visibility and sharing
    is_public = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # User engagement
    view_count = Column(Integer, default=0)
    download_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign key relationships
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="images")
    
    def __repr__(self):
        return f"<Image(id={self.id}, filename='{self.filename}', user='{self.user.username if self.user else 'Unknown'}')>"
    
    @property
    def public_data(self):
        """Return image data for public consumption"""
        return {
            "uuid": self.uuid,
            "filename": self.filename,
            "original_filename": self.original_filename,
            "file_size": self.file_size,
            "mime_type": self.mime_type,
            "width": self.width,
            "height": self.height,
            "format": self.format,
            "cloud_types": self.cloud_types,
            "weather_prediction": self.weather_prediction,
            "location_analysis": self.location_analysis,
            "confidence_scores": self.confidence_scores,
            "analysis_status": self.analysis_status,
            "location_name": self.location_name,
            "taken_at": self.taken_at,
            "is_featured": self.is_featured,
            "view_count": self.view_count,
            "created_at": self.created_at,
            "user": self.user.public_data if self.user else None
        }
    
    @property
    def admin_data(self):
        """Return image data for admin/owner management"""
        return {
            "id": self.id,
            "uuid": self.uuid,
            "filename": self.filename,
            "original_filename": self.original_filename,
            "file_path": self.file_path,
            "file_size": self.file_size,
            "mime_type": self.mime_type,
            "width": self.width,
            "height": self.height,
            "format": self.format,
            "cloud_types": self.cloud_types,
            "weather_prediction": self.weather_prediction,
            "location_analysis": self.location_analysis,
            "confidence_scores": self.confidence_scores,
            "analysis_status": self.analysis_status,
            "analysis_started_at": self.analysis_started_at,
            "analysis_completed_at": self.analysis_completed_at,
            "analysis_error": self.analysis_error,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "altitude": self.altitude,
            "location_name": self.location_name,
            "camera_make": self.camera_make,
            "camera_model": self.camera_model,
            "taken_at": self.taken_at,
            "iso": self.iso,
            "aperture": self.aperture,
            "shutter_speed": self.shutter_speed,
            "focal_length": self.focal_length,
            "is_public": self.is_public,
            "is_featured": self.is_featured,
            "view_count": self.view_count,
            "download_count": self.download_count,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "user_id": self.user_id
        }
    
    @property
    def url(self):
        """Get the public URL for this image"""
        return f"/uploads/{self.filename}"
    
    def increment_view_count(self):
        """Increment the view count for this image"""
        self.view_count += 1
    
    def increment_download_count(self):
        """Increment the download count for this image"""
        self.download_count += 1
    
    def update_analysis_status(self, status: str, error: str = None):
        """Update the analysis status"""
        self.analysis_status = status
        if status == "processing":
            self.analysis_started_at = func.now()
        elif status in ["completed", "failed"]:
            self.analysis_completed_at = func.now()
        if error:
            self.analysis_error = error
