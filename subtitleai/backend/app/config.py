from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache

class Settings(BaseSettings):
    # App
    APP_NAME: str = "SubtitleAI"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str
    
    # Cache
    CACHE_TTL: int = 3600  # 1 hour
    CACHE_ENABLED: bool = True
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # Cloudflare R2
    R2_ENDPOINT: str
    R2_ACCESS_KEY: str
    R2_SECRET_KEY: str
    R2_BUCKET: str
    R2_PUBLIC_URL: Optional[str] = None
    
    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 2147483648  # 2GB
    
    # AI Models
    GEMINI_API_KEY: str
    USE_WHISPER: bool = True  # Use local Whisper for cost savings
    WHISPER_MODEL: str = "base"  # tiny, base, small, medium, large
    
    # Razorpay
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # File Processing
    MAX_FILE_SIZE: int = 2 * 1024 * 1024 * 1024  # 2GB
    MAX_VIDEO_DURATION: int = 7200  # 2 hours
    CHUNK_SIZE: int = 1024 * 1024  # 1MB chunks
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()