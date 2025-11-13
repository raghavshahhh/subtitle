from celery import Celery
from app.config import settings
from app.services.gemini_service import gemini_service
from app.services.whisper_service import whisper_service
from app.services.audio_service import audio_service
from app.services.storage_service import storage_service
from app.database import SessionLocal
from app.models.project import Project
from app.models.subtitle import Subtitle
import tempfile
import os
import time
import asyncio

celery_app = Celery(
    "subtitleai",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour max
    task_soft_time_limit=3300,  # 55 minutes soft limit
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=50,
)

def run_async(coro):
    """Helper to run async functions in sync context"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()

@celery_app.task(bind=True, max_retries=3)
def process_video_task(self, project_id: int, use_whisper: bool = True):
    """Complete video processing pipeline"""
    db = SessionLocal()
    audio_path = None
    start_time = time.time()
    
    try:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return {"error": "Project not found"}
        
        project.status = "processing"
        db.commit()
        
        # Create temp audio file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
            audio_path = temp_audio.name
        
        # Step 1: Extract audio from video
        print(f"[Project {project_id}] Extracting audio...")
        run_async(audio_service.extract_audio(project.video_url, audio_path, enhance=True))
        
        # Step 2: Transcribe audio
        print(f"[Project {project_id}] Transcribing with {'Whisper' if use_whisper else 'Gemini'}...")
        
        if use_whisper:
            subtitles_data = run_async(
                whisper_service.transcribe_audio(audio_path, project.language)
            )
        else:
            subtitles_data = run_async(
                gemini_service.transcribe_audio(audio_path, project.language)
            )
        
        # Step 3: Save subtitles to database
        print(f"[Project {project_id}] Saving {len(subtitles_data)} subtitles...")
        
        for sub_data in subtitles_data:
            subtitle = Subtitle(
                project_id=project.id,
                start_time=sub_data["start"],
                end_time=sub_data["end"],
                text=sub_data["text"],
                original_text=sub_data["text"],
                confidence=sub_data.get("confidence", 0.95)
            )
            db.add(subtitle)
        
        # Step 4: Update project status
        processing_time = time.time() - start_time
        project.status = "completed"
        project.accuracy_score = sum(s.get("confidence", 0.95) for s in subtitles_data) / len(subtitles_data) if subtitles_data else 0
        project.processing_time = processing_time
        
        # Get video duration
        try:
            video_info = run_async(audio_service.get_video_info(project.video_url))
            project.duration = video_info.get("duration")
        except:
            pass
        
        db.commit()
        
        print(f"[Project {project_id}] Completed in {processing_time:.2f}s")
        
        return {
            "status": "completed",
            "project_id": project_id,
            "subtitles_count": len(subtitles_data),
            "processing_time": processing_time,
            "accuracy_score": project.accuracy_score
        }
        
    except Exception as e:
        print(f"[Project {project_id}] Error: {str(e)}")
        
        if project:
            project.status = "failed"
            db.commit()
        
        # Retry with exponential backoff
        if self.request.retries < self.max_retries:
            raise self.retry(exc=e, countdown=2 ** self.request.retries)
        
        return {"error": str(e), "project_id": project_id}
        
    finally:
        # Cleanup
        if audio_path and os.path.exists(audio_path):
            os.unlink(audio_path)
        db.close()