from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

def get_current_user_optional(db: Session = Depends(get_db)):
    """Get demo user for development"""
    try:
        # Use ORM instead of raw SQL to prevent SQL injection
        user = db.query(User).filter(User.email == "demo@subtitleai.com").first()
        if not user:
            user = User(
                email="demo@subtitleai.com",
                name="Demo User", 
                plan="Free",
                credits=100,
                credits_used=0,
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info("Demo user created")
        return user
    except Exception as e:
        logger.error(f"Error getting demo user: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/signup")
async def signup():
    try:
        return {"message": "Demo mode - no signup required"}
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(status_code=500, detail="Signup failed")

@router.post("/login") 
async def login():
    try:
        return {"message": "Demo mode - no login required", "user": {"email": "demo@subtitleai.com"}}
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user_optional)):
    try:
        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return {
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "plan": current_user.plan
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get user error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get user info")
