from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.services.storage_service import storage_service
from app.services.cache_service import cache_service
from app.tasks.transcription_tasks import process_video_task
from app.api.auth import get_current_user
from app.config import settings
from app.utils.logger import logger
from app.exceptions import InvalidFileTypeException, FileTooLargeException
import uuid
import time

router = APIRouter()

ALLOWED_VIDEO_TYPES = {
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm"
}

@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    title: str = Form("Untitled Project"),
    language: str = Form("hi"),
    use_whisper: bool = Form(True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload video and start processing"""
    
    start_time = time.time()
    
    # Validate file type
    if file.content_type not in ALLOWED_VIDEO_TYPES:
        logger.warning("invalid_file_type", content_type=file.content_type)
        raise InvalidFileTypeException(file.content_type)
    
    # Validate file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset
    
    if file_size > settings.MAX_FILE_SIZE:
        logger.warning("file_too_large", size=file_size, max=settings.MAX_FILE_SIZE)
        raise FileTooLargeException(file_size, settings.MAX_FILE_SIZE)
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'mp4'
    filename = f"{file_id}.{file_ext}"
    
    logger.info(
        "uploading_video",
        user_id=current_user.id,
        filename=filename,
        size=file_size,
        language=language
    )
    
    # Upload to R2
    video_url = await storage_service.upload_file(
        file.file,
        f"videos/{filename}",
        content_type=file.content_type
    )
    
    # Create project
    project = Project(
        user_id=current_user.id,
        title=title,
        video_url=video_url,
        language=language,
        file_size=file_size,
        status="processing",
        transcription_method="whisper" if use_whisper else "gemini"
    )
    
    db.add(project)
    db.commit()
    db.refresh(project)
    
    # Clear user's project cache
    await cache_service.clear_pattern(f"user:{current_user.id}:projects:*")
    
    # Start async processing
    process_video_task.delay(project.id, use_whisper)
    
    upload_time = time.time() - start_time
    
    logger.info(
        "video_uploaded",
        project_id=project.id,
        user_id=current_user.id,
        upload_time=upload_time
    )
    
    return {
        "project_id": project.id,
        "status": "processing",
        "message": "Video uploaded successfully. Processing started.",
        "video_url": video_url,
        "upload_time": upload_time
    }