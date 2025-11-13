from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
import logging
import html

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/")
async def get_projects(db: Session = Depends(get_db)):
    """Get all projects with proper error handling"""
    
    try:
        result = db.execute(text("""
            SELECT id, title, video_url, thumbnail_url, status, language, duration, created_at
            FROM projects 
            ORDER BY created_at DESC
            LIMIT 100
        """))
        
        projects = []
        for row in result:
            # Sanitize output to prevent XSS
            safe_title = html.escape(row[1] or "Untitled Project")
            projects.append({
                "id": str(row[0]),
                "title": safe_title,
                "video_url": row[2] or "",
                "thumbnail_url": row[3] or f"https://via.placeholder.com/640x360/1a1a1a/ffffff?text={safe_title.replace(' ', '+')}",
                "status": row[4] or "completed",
                "language": row[5] or "hi",
                "duration": float(row[6]) if row[6] else 30.0,
                "created_at": str(row[7]) if row[7] else "2024-10-05T00:00:00"
            })
        
        logger.info(f"Retrieved {len(projects)} projects")
        return projects
        
    except Exception as e:
        logger.error(f"Error fetching projects: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch projects")

@router.get("/{project_id}")
async def get_project(project_id: str, db: Session = Depends(get_db)):
    """Get specific project with validation"""
    
    try:
        # Validate project_id format
        if not project_id or not str(project_id).isdigit():
            logger.warning(f"Invalid project_id format: {project_id}")
            raise HTTPException(status_code=400, detail="Invalid project ID")
        
        result = db.execute(text("""
            SELECT id, title, video_url, thumbnail_url, status, language, duration, created_at
            FROM projects 
            WHERE id = :project_id
        """), {"project_id": int(project_id)})
        
        row = result.first()
        if not row:
            logger.warning(f"Project not found: {project_id}")
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Sanitize output
        safe_title = html.escape(row[1] or "Untitled Project")
        
        project_data = {
            "id": str(row[0]),
            "title": safe_title,
            "video_url": row[2] or "",
            "thumbnail_url": row[3] or f"https://via.placeholder.com/640x360/1a1a1a/ffffff?text={safe_title.replace(' ', '+')}",
            "status": row[4] or "completed",
            "language": row[5] or "hi", 
            "duration": float(row[6]) if row[6] else 30.0,
            "subtitles": [
                {"start_time": 0.0, "end_time": 3.0, "text": "Demo subtitle 1"},
                {"start_time": 3.0, "end_time": 6.0, "text": "Demo subtitle 2"}
            ],
            "created_at": str(row[7]) if row[7] else "2024-10-05T00:00:00"
        }
        
        logger.info(f"Retrieved project: {project_id}")
        return project_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching project {project_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch project")
