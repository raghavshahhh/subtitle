from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class SubtitleBase(BaseModel):
    start_time: float = Field(..., ge=0, description="Start time in seconds")
    end_time: float = Field(..., ge=0, description="End time in seconds")
    text: str = Field(..., min_length=1, max_length=500)
    
    @validator('end_time')
    def end_time_must_be_after_start(cls, v, values):
        if 'start_time' in values and v <= values['start_time']:
            raise ValueError('end_time must be greater than start_time')
        return v

class SubtitleResponse(SubtitleBase):
    id: int
    confidence: float
    is_edited: bool
    
    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    language: str = Field(default="hi", pattern="^[a-z]{2}$")
    use_whisper: bool = True

class ProjectResponse(BaseModel):
    id: int
    title: str
    status: str
    video_url: str
    thumbnail_url: Optional[str]
    duration: Optional[float]
    language: str
    accuracy_score: Optional[float]
    created_at: datetime
    subtitle_count: Optional[int] = 0
    
    class Config:
        from_attributes = True

class ProjectDetailResponse(ProjectResponse):
    description: Optional[str]
    file_size: Optional[int]
    processing_time: Optional[float]
    subtitles: Optional[List[SubtitleResponse]] = []
