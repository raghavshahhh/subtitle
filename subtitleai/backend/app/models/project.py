from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Text, JSON, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Video details
    title = Column(String, nullable=False)
    description = Column(Text)
    video_url = Column(String, nullable=False)  # R2 URL
    audio_url = Column(String)  # Extracted audio
    thumbnail_url = Column(String)
    
    # Processing
    status = Column(String, default="uploading", index=True)  # uploading, processing, completed, failed
    duration = Column(Float)  # seconds
    file_size = Column(Integer)  # bytes
    language = Column(String, default="hi", index=True)
    
    # AI processing
    transcription_job_id = Column(String)
    transcription_method = Column(String, default="whisper")  # whisper, gemini
    accuracy_score = Column(Float)
    processing_time = Column(Float)  # seconds
    
    # Settings
    settings = Column(JSON, default={})  # styling, export preferences
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    subtitles = relationship("Subtitle", back_populates="project", cascade="all, delete-orphan")
    
    # Composite indexes for common queries
    __table_args__ = (
        Index('idx_user_status', 'user_id', 'status'),
        Index('idx_user_created', 'user_id', 'created_at'),
    )