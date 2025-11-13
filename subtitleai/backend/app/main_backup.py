from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import auth, upload, projects, subtitles, export, payment
from app.database import engine, Base
from app.config import settings
from app.utils.logger import logger
from app.exceptions import SubtitleAIException
import sentry_sdk
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from prometheus_fastapi_instrumentator import Instrumentator
import time

# Sentry
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1
    )
    logger.info("sentry_initialized")

# Rate Limiter
limiter = Limiter(key_func=get_remote_address)

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("database_tables_created")
except Exception as e:
    logger.error("database_connection_failed", error=str(e))

# FastAPI app
app = FastAPI(
    title="SubtitleAI API",
    version="2.0.0",
    description="AI-powered subtitle generation and editing",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
allowed_origins = [
    "https://subtitleai.ragspro.com",
    "https://www.subtitleai.ragspro.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

if settings.DEBUG:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    logger.info(
        "request_completed",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
        process_time=process_time
    )
    
    return response

# Prometheus metrics
Instrumentator().instrument(app).expose(app)

# Custom exception handler
@app.exception_handler(SubtitleAIException)
async def subtitle_ai_exception_handler(request: Request, exc: SubtitleAIException):
    logger.error(
        "subtitle_ai_exception",
        path=request.url.path,
        status_code=exc.status_code,
        detail=exc.detail
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(
        "unhandled_exception",
        path=request.url.path,
        error=str(exc),
        exc_info=True
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(subtitles.router, prefix="/api/subtitles", tags=["Subtitles"])
app.include_router(export.router, prefix="/api/export", tags=["Export"])
app.include_router(payment.router, prefix="/api/payment", tags=["Payment"])

@app.on_event("startup")
async def startup_event():
    logger.info("application_startup", environment=settings.ENVIRONMENT)

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("application_shutdown")

@app.get("/")
@limiter.limit("100/minute")
async def root(request: Request):
    return {
        "message": "SubtitleAI API is running 🔥",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
        "docs": "/api/docs"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    try:
        # Check database
        conn = engine.connect()
        conn.close()
        
        return {
            "status": "healthy",
            "database": "connected",
            "cache": "enabled" if settings.CACHE_ENABLED else "disabled",
            "version": "2.0.0"
        }
    except Exception as e:
        logger.error("health_check_failed", error=str(e))
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e) if settings.DEBUG else "Service unavailable"
            }
        )