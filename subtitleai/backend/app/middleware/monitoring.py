"""
Monitoring and metrics middleware
"""
from prometheus_client import Counter, Histogram, generate_latest
from fastapi import Request, Response
from fastapi.responses import PlainTextResponse
import time
import logging

logger = logging.getLogger(__name__)

# Metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

UPLOAD_COUNT = Counter(
    'video_uploads_total',
    'Total video uploads',
    ['status']
)

SUBTITLE_GENERATION_COUNT = Counter(
    'subtitle_generations_total',
    'Total subtitle generations',
    ['status']
)

EXPORT_COUNT = Counter(
    'subtitle_exports_total',
    'Total subtitle exports',
    ['format']
)


async def metrics_middleware(request: Request, call_next):
    """Middleware to track request metrics"""
    start_time = time.time()
    
    # Process request
    response = await call_next(request)
    
    # Calculate duration
    duration = time.time() - start_time
    
    # Record metrics
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    
    REQUEST_DURATION.labels(
        method=request.method,
        endpoint=request.url.path
    ).observe(duration)
    
    # Log slow requests
    if duration > 1.0:
        logger.warning(
            f"Slow request: {request.method} {request.url.path} took {duration:.2f}s"
        )
    
    return response


async def metrics_endpoint(request: Request):
    """Endpoint to expose Prometheus metrics"""
    return PlainTextResponse(generate_latest())


def track_upload(status: str):
    """Track video upload"""
    UPLOAD_COUNT.labels(status=status).inc()


def track_subtitle_generation(status: str):
    """Track subtitle generation"""
    SUBTITLE_GENERATION_COUNT.labels(status=status).inc()


def track_export(format: str):
    """Track subtitle export"""
    EXPORT_COUNT.labels(format=format).inc()
