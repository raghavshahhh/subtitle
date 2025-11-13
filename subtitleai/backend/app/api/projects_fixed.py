from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project
from app.models.user import User
from typing import List

router = APIRouter()

@router.get("/")
async def get_projects(db: Session = Depends(get_db)):
    """Get all projects for demo user"""
    
    # Get or create demo user
    demo_user = db.query(User).filter(User.email == "demo@subtitleai.com").first()
    if not demo_user:
        demo_user = User(
            email="demo@subtitleai.com",
            name="Demo User",
            plan="Free", 
            credits=100,
            credits_used=0,
            is_active=True
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
    
    # Get projects
    projects = db.query(Project).filter(Project.user_id == demo_user.id).all()
    
    return [
        {
            "id": str(project.id),
            "title": project.title,
            "video_url": project.video_url,
            "thumbnail_url": project.thumbnail_url,
            "status": project.status,
            "language": project.language,
            "duration": project.duration,
            "created_at": project.created_at.isoformat() if project.created_at else None
        }
        for project in projects
    ]

@router.get("/{project_id}")
async def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get specific project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {
        "id": str(project.id),
        "title": project.title,
        "video_url": project.video_url,
        "thumbnail_url": project.thumbnail_url,
        "status": project.status,
        "language": project.language,
        "duration": project.duration,
        "subtitles": [],  # TODO: Add subtitles
        "created_at": project.created_at.isoformat() if project.created_at else None
    }
