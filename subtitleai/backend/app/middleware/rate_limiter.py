"""
Rate limiting middleware for API protection
"""
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
import os

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"],
    storage_uri=os.getenv("REDIS_URL", "memory://"),
    strategy="fixed-window"
)

# Rate limit configurations for different endpoints
RATE_LIMITS = {
    "auth": "5/minute",  # Login/signup
    "upload": "10/hour",  # Video uploads
    "api": "60/minute",  # General API calls
    "export": "30/hour"  # Export operations
}

def get_rate_limit(endpoint_type: str) -> str:
    """Get rate limit for specific endpoint type"""
    return RATE_LIMITS.get(endpoint_type, "100/minute")
