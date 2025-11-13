from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.api import auth_simple, upload_fixed, projects_fixed
import os

# Create FastAPI app
app = FastAPI(
    title="SubtitleAI API",
    description="AI-powered subtitle generation API",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Mount static files for uploads
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth_simple.router, prefix="/api/auth", tags=["auth"])
app.include_router(upload_fixed.router, prefix="/api/upload", tags=["upload"])
app.include_router(projects_fixed.router, prefix="/api/projects", tags=["projects"])

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
    return {"status": "healthy", "timestamp": "2024-10-05T00:00:00Z"}
