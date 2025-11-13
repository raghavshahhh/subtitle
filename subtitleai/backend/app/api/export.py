from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.subtitle import Subtitle
from app.models.project import Project
from app.api.auth import get_current_user
from app.models.user import User
from app.services.storage_service import storage_service
from app.utils.subtitle_formatter import SubtitleFormatter
import tempfile
import os

router = APIRouter()

@router.post("/{project_id}")
async def export_subtitles(
    project_id: int,
    format: str = "srt",  # srt, vtt, mp4
    style: dict = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get subtitles
    subtitles = db.query(Subtitle).filter(
        Subtitle.project_id == project_id
    ).order_by(Subtitle.start_time).all()
    
    if not subtitles:
        raise HTTPException(status_code=400, detail="No subtitles found")
    
    formatter = SubtitleFormatter()
    
    if format == "srt":
        content = formatter.to_srt(subtitles)
        filename = f"project_{project_id}.srt"
        content_type = "text/plain"
    
    elif format == "vtt":
        content = formatter.to_vtt(subtitles)
        filename = f"project_{project_id}.vtt"
        content_type = "text/vtt"
    
    elif format == "mp4":
        # Burn subtitles into video
        output_path = await formatter.burn_subtitles(
            project.video_url,
            subtitles,
            style or {}
        )
        
        # Upload to R2
        with open(output_path, 'rb') as f:
            download_url = await storage_service.upload_file(
                f,
                f"exports/project_{project_id}_subtitled.mp4"
            )
        
        os.unlink(output_path)
        
        return {
            "download_url": download_url,
            "format": "mp4",
            "expires_in": 3600  # 1 hour
        }
    
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")
    
    # Upload text file to R2
    with tempfile.NamedTemporaryFile(mode='w', suffix=f'.{format}', delete=False) as f:
        f.write(content)
        temp_path = f.name
    
    with open(temp_path, 'rb') as f:
        download_url = await storage_service.upload_file(
            f,
            f"exports/{filename}"
        )
    
    os.unlink(temp_path)
    
    return {
        "download_url": download_url,
        "format": format,
        "expires_in": 3600
    }