from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from app.database import engine, Base
from app.api import auth_simple, upload_fixed, projects_simple
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="SubtitleAI API",
    description="AI-powered subtitle generation API",
    version="2.0.0"
)

# CORS - Production ready
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Failed to create database tables: {str(e)}")

# Mount static files for uploads
try:
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        logger.info(f"Created upload directory: {upload_dir}")
    app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")
except Exception as e:
    logger.error(f"Failed to mount uploads directory: {str(e)}")

# Include routers
app.include_router(auth_simple.router, prefix="/api/auth", tags=["auth"])
app.include_router(upload_fixed.router, prefix="/api/upload", tags=["upload"])
app.include_router(projects_simple.router, prefix="/api/projects", tags=["projects"])

@app.get("/")
async def root():
    return {
        "message": "SubtitleAI API is running 🔥",
        "version": "2.0.0",
        "environment": "production",
        "docs": "/api/docs"
    }

@app.get("/api/health")
async def health():
    try:
        return {
            "status": "healthy",
            "version": "2.0.0",
            "environment": "production"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "error": str(e)}
        )
