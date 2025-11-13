from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Text, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Subtitle(Base):
    __tablename__ = "subtitles"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Timing
    start_time = Column(Float, nullable=False, index=True)  # seconds
    end_time = Column(Float, nullable=False, index=True)
    
    # Content
    text = Column(Text, nullable=False)
    original_text = Column(Text)  # Before user edits
    
    # Speaker (for multi-speaker videos)
    speaker = Column(String, default="Speaker 1")
    confidence = Column(Float, default=1.0)
    
    # Styling
    style = Column(String, default="default")
    position = Column(String, default="bottom")  # bottom, top, center
    
    # Metadata
    is_edited = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="subtitles")
    
    # Composite indexes for common queries
    __table_args__ = (
        Index('idx_project_time', 'project_id', 'start_time'),
        Index('idx_project_edited', 'project_id', 'is_edited'),
    )