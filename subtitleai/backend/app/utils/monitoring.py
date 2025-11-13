import time
import logging
from functools import wraps
from typing import Callable
import sentry_sdk

logger = logging.getLogger(__name__)

def monitor_performance(func: Callable):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        try:
            result = await func(*args, **kwargs)
            duration = time.time() - start
            logger.info(f"{func.__name__} completed in {duration:.2f}s")
            return result
        except Exception as e:
            duration = time.time() - start
            logger.error(f"{func.__name__} failed after {duration:.2f}s: {e}")
            sentry_sdk.capture_exception(e)
            raise
    return wrapper

def log_api_call(endpoint: str, user_id: int = None):
    logger.info(f"API call: {endpoint} | User: {user_id}")
