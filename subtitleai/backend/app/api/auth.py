from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.config import settings
import jwt

router = APIRouter()
security = HTTPBearer()

# Initialize Supabase client only if credentials are available
supabase = None
try:
    from supabase import create_client, Client
    if settings.SUPABASE_URL != "https://your-project.supabase.co" and settings.SUPABASE_KEY != "your-anon-key":
        supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
except Exception as e:
    print(f"Supabase not configured: {e}")

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    if not supabase:
        # Development mode - create a demo user
        user = db.query(User).filter(User.email == "demo@example.com").first()
        if not user:
            user = User(email="demo@example.com", name="Demo User")
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    
    try:
        # Verify Supabase JWT
        user_data = supabase.auth.get_user(credentials.credentials)
        if not user_data.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get or create user in our DB
        user = db.query(User).filter(User.email == user_data.user.email).first()
        if not user:
            user = User(
                email=user_data.user.email,
                name=user_data.user.user_metadata.get("name", "User")
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/login")
async def login(email: str, password: str):
    if not supabase:
        # Development mode - return demo token
        return {
            "access_token": "demo-token",
            "user": {"email": "demo@example.com", "name": "Demo User"}
        }
    
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return {
            "access_token": response.session.access_token,
            "user": response.user
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/signup")
async def signup(email: str, password: str, name: str):
    if not supabase:
        # Development mode - return demo response
        return {
            "message": "Demo mode - user created",
            "user": {"email": email, "name": name}
        }
    
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": {"name": name}}
        })
        return {
            "message": "Check your email for verification",
            "user": response.user
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user