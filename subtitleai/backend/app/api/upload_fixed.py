from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
import uuid
import os
import shutil
import re
import logging
from pathlib import Path

logger = logging.getLogger(__name__)
router = APIRouter()

ALLOWED_VIDEO_TYPES = {
    "video/mp4",
    "video/quicktime", 
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm"
}

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm"}
MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024  # 2GB

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal"""
    # Remove any path components
    filename = os.path.basename(filename)
    # Remove any non-alphanumeric characters except dots and dashes
    filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
    return filename

@router.post("/video")
async def upload_video(
    file: UploadFile = File(...),
    title: str = Form("Untitled Project"),
    language: str = Form("hi"),
    use_whisper: bool = Form(True),
    db: Session = Depends(get_db)
):
    """Upload video and create project with security validations"""
    
    try:
        # Validate file type
        if file.content_type not in ALLOWED_VIDEO_TYPES:
            logger.warning(f"Invalid file type attempted: {file.content_type}")
            raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: MP4, MOV, AVI, MKV, WEBM")
        
        # Validate file extension
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            logger.warning(f"Invalid file extension: {file_extension}")
            raise HTTPException(status_code=400, detail=f"Invalid file extension")
        
        # Sanitize filename to prevent path traversal
        safe_filename = sanitize_filename(file.filename)
        
        # Create demo user if not exists
        result = db.execute(text("SELECT id FROM users WHERE email = :email"), 
                          {"email": "demo@subtitleai.com"})
        user_row = result.first()
        
        if not user_row:
            db.execute(text("""
                INSERT INTO users (email, name, plan, credits, credits_used, is_active) 
                VALUES (:email, :name, :plan, :credits, :credits_used, :is_active)
            """), {
                "email": "demo@subtitleai.com",
                "name": "Demo User",
                "plan": "Free",
                "credits": 100,
                "credits_used": 0,
                "is_active": 1
            })
            db.commit()
            
            result = db.execute(text("SELECT id FROM users WHERE email = :email"), 
                              {"email": "demo@subtitleai.com"})
            user_row = result.first()
        
        user_id = user_row[0]
        
        # Create uploads directory securely
        upload_dir = Path("uploads").resolve()
        upload_dir.mkdir(exist_ok=True)
        
        # Generate unique filename with sanitized extension
        file_id = str(uuid.uuid4())
        filename = f"{file_id}{file_extension}"
        file_path = (upload_dir / filename).resolve()
        
        # Verify file path is within upload directory (prevent path traversal)
        if not str(file_path).startswith(str(upload_dir)):
            logger.error(f"Path traversal attempt detected: {file_path}")
            raise HTTPException(status_code=400, detail="Invalid file path")
        
        # Save file with size limit
        file_size = 0
        with open(file_path, "wb") as buffer:
            while chunk := await file.read(8192):  # Read in chunks
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE:
                    buffer.close()
                    os.remove(file_path)
                    raise HTTPException(status_code=400, detail="File too large (max 2GB)")
                buffer.write(chunk)
        
        logger.info(f"File uploaded: {filename}, size: {file_size} bytes")
        
        # Sanitize title
        safe_title = title[:200] if title else "Untitled Project"
        
        # Create project using parameterized query
        db.execute(text("""
            INSERT INTO projects (user_id, title, video_url, status, language, duration, file_size) 
            VALUES (:user_id, :title, :video_url, :status, :language, :duration, :file_size)
        """), {
            "user_id": user_id,
            "title": safe_title,
            "video_url": f"/uploads/{filename}",
            "status": "completed",
            "language": language,
            "duration": 30.0,
            "file_size": file_size
        })
        db.commit()
        
        # Get the created project
        result = db.execute(text("SELECT id FROM projects WHERE video_url = :video_url"), 
                           {"video_url": f"/uploads/{filename}"})
        project_row = result.first()
        
        if not project_row:
            raise HTTPException(status_code=500, detail="Failed to create project")
        
        project_id = project_row[0]
        
        logger.info(f"Project created: {project_id}")
        
        return {
            "success": True,
            "project_id": project_id,
            "message": "Video uploaded successfully",
            "data": {
                "id": project_id,
                "title": safe_title,
                "video_url": f"/uploads/{filename}",
                "status": "completed",
                "language": language
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        db.rollback()
        # Clean up file if it was created
        if 'file_path' in locals() and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except:
                pass
        raise HTTPException(status_code=500, detail="Upload failed")
