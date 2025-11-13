from fastapi import HTTPException, status

class SubtitleAIException(HTTPException):
    """Base exception for SubtitleAI"""
    def __init__(self, detail: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        super().__init__(status_code=status_code, detail=detail)

class ProjectNotFoundException(SubtitleAIException):
    def __init__(self, project_id: int):
        super().__init__(
            detail=f"Project {project_id} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )

class UnauthorizedException(SubtitleAIException):
    def __init__(self, detail: str = "Unauthorized access"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_401_UNAUTHORIZED
        )

class FileTooLargeException(SubtitleAIException):
    def __init__(self, size: int, max_size: int):
        super().__init__(
            detail=f"File size {size} exceeds maximum {max_size}",
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
        )

class InvalidFileTypeException(SubtitleAIException):
    def __init__(self, file_type: str):
        super().__init__(
            detail=f"Invalid file type: {file_type}. Only video files allowed",
            status_code=status.HTTP_400_BAD_REQUEST
        )

class ProcessingException(SubtitleAIException):
    def __init__(self, detail: str):
        super().__init__(
            detail=f"Processing failed: {detail}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class TranscriptionException(SubtitleAIException):
    def __init__(self, detail: str):
        super().__init__(
            detail=f"Transcription failed: {detail}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class StorageException(SubtitleAIException):
    def __init__(self, detail: str):
        super().__init__(
            detail=f"Storage operation failed: {detail}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class InsufficientCreditsException(SubtitleAIException):
    def __init__(self):
        super().__init__(
            detail="Insufficient credits. Please upgrade your plan",
            status_code=status.HTTP_402_PAYMENT_REQUIRED
        )
