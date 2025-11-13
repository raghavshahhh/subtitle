from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from app.database import get_db
from app.models.project import Project
from app.models.subtitle import Subtitle
from app.api.auth import get_current_user
from app.models.user import User
from app.services.cache_service import cache_service
from app.services.storage_service import storage_service
from app.utils.logger import logger
from app.exceptions import ProjectNotFoundException, UnauthorizedException
from typing import List, Optional

router = APIRouter()

@router.get("/")
async def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's projects with pagination and filtering"""
    
    # Try cache first
    cache_key = f"user:{current_user.id}:projects:{skip}:{limit}:{status}"
    cached = await cache_service.get(cache_key)
    if cached:
        return cached
    
    # Query with optimizations
    query = db.query(Project).filter(Project.user_id == current_user.id)
    
    if status:
        query = query.filter(Project.status == status)
    
    projects = (
        query
        .order_by(desc(Project.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    result = {
        "projects": [{
            "id": p.id,
            "title": p.title,
            "status": p.status,
            "duration": p.duration,
            "language": p.language,
            "thumbnail_url": p.thumbnail_url,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "subtitle_count": len(p.subtitles)
        } for p in projects],
        "total": query.count(),
        "skip": skip,
        "limit": limit
    }
    
    # Cache for 5 minutes
    await cache_service.set(cache_key, result, ttl=300)
    
    logger.info("projects_fetched", user_id=current_user.id, count=len(projects))
    return result

@router.get("/{project_id}")
async def get_project(
    project_id: int,
    include_subtitles: bool = Query(True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get project details with optional subtitles"""
    
    # Try cache first
    cache_key = f"project:{project_id}:user:{current_user.id}:subs:{include_subtitles}"
    cached = await cache_service.get(cache_key)
    if cached:
        return cached
    
    # Query with eager loading if needed
    query = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    )
    
    if include_subtitles:
        query = query.options(joinedload(Project.subtitles))
    
    project = query.first()
    
    if not project:
        raise ProjectNotFoundException(project_id)
    
    result = {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "video_url": project.video_url,
        "thumbnail_url": project.thumbnail_url,
        "status": project.status,
        "duration": project.duration,
        "file_size": project.file_size,
        "language": project.language,
        "accuracy_score": project.accuracy_score,
        "processing_time": project.processing_time,
        "settings": project.settings,
        "created_at": project.created_at.isoformat() if project.created_at else None,
        "updated_at": project.updated_at.isoformat() if project.updated_at else None
    }
    
    if include_subtitles:
        result["subtitles"] = [{
            "id": s.id,
            "start_time": s.start_time,
            "end_time": s.end_time,
            "text": s.text,
            "confidence": s.confidence,
            "is_edited": s.is_edited
        } for s in sorted(project.subtitles, key=lambda x: x.start_time)]
    
    # Cache for 10 minutes
    await cache_service.set(cache_key, result, ttl=600)
    
    logger.info("project_fetched", project_id=project_id, user_id=current_user.id)
    return result

@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete project and associated files"""
    
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise ProjectNotFoundException(project_id)
    
    # Delete files from storage
    try:
        if project.video_url:
            video_key = project.video_url.split('/')[-1]
            await storage_service.delete_file(f"videos/{video_key}")
        
        if project.audio_url:
            audio_key = project.audio_url.split('/')[-1]
            await storage_service.delete_file(f"audio/{audio_key}")
        
        if project.thumbnail_url:
            thumb_key = project.thumbnail_url.split('/')[-1]
            await storage_service.delete_file(f"thumbnails/{thumb_key}")
    except Exception as e:
        logger.error("file_deletion_error", project_id=project_id, error=str(e))
    
    # Delete from database (cascades to subtitles)
    db.delete(project)
    db.commit()
    
    # Clear cache
    await cache_service.clear_pattern(f"*project:{project_id}*")
    await cache_service.clear_pattern(f"user:{current_user.id}:projects:*")
    
    logger.info("project_deleted", project_id=project_id, user_id=current_user.id)
    return {"message": "Project deleted successfully"}