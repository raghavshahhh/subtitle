from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.subtitle import Subtitle
from app.models.project import Project
from app.api.auth import get_current_user
from app.models.user import User
from app.services.gemini_service import gemini_service
from typing import List

router = APIRouter()

@router.get("/{project_id}")
async def get_subtitles(
    project_id: int,
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
    
    subtitles = db.query(Subtitle).filter(
        Subtitle.project_id == project_id
    ).order_by(Subtitle.start_time).all()
    
    return {"subtitles": subtitles}

@router.put("/{subtitle_id}")
async def update_subtitle(
    subtitle_id: int,
    text: str,
    start_time: float = None,
    end_time: float = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    subtitle = db.query(Subtitle).join(Project).filter(
        Subtitle.id == subtitle_id,
        Project.user_id == current_user.id
    ).first()
    
    if not subtitle:
        raise HTTPException(status_code=404, detail="Subtitle not found")
    
    subtitle.text = text
    subtitle.is_edited = True
    
    if start_time is not None:
        subtitle.start_time = start_time
    if end_time is not None:
        subtitle.end_time = end_time
    
    db.commit()
    db.refresh(subtitle)
    
    return subtitle

@router.post("/{project_id}/translate")
async def translate_subtitles(
    project_id: int,
    target_language: str,
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
    
    # Get current subtitles
    subtitles = db.query(Subtitle).filter(
        Subtitle.project_id == project_id
    ).order_by(Subtitle.start_time).all()
    
    # Format for Gemini
    subtitle_data = [
        {
            "start": sub.start_time,
            "end": sub.end_time,
            "text": sub.text
        }
        for sub in subtitles
    ]
    
    # Translate using Gemini
    translated = await gemini_service.translate_subtitles(
        subtitle_data,
        project.language,
        target_language
    )
    
    # Update subtitles
    for i, sub in enumerate(subtitles):
        if i < len(translated):
            sub.text = translated[i]["text"]
            sub.is_edited = True
    
    db.commit()
    
    return {"message": f"Subtitles translated to {target_language}"}