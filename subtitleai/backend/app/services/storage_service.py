import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from app.config import settings
import uuid
import asyncio
from typing import BinaryIO, Optional
from app.utils.logger import logger
from app.exceptions import StorageException

class StorageService:
    def __init__(self):
        self.client = boto3.client(
            's3',
            endpoint_url=settings.R2_ENDPOINT,
            aws_access_key_id=settings.R2_ACCESS_KEY,
            aws_secret_access_key=settings.R2_SECRET_KEY,
            config=Config(
                signature_version='s3v4',
                retries={'max_attempts': 3, 'mode': 'adaptive'}
            ),
            region_name='auto'
        )
        self.bucket = settings.R2_BUCKET
        self.public_url = settings.R2_PUBLIC_URL or settings.R2_ENDPOINT
    
    async def upload_file(self, file: BinaryIO, key: str, content_type: Optional[str] = None) -> str:
        """Upload file to R2 and return public URL"""
        try:
            logger.info("uploading_file", key=key, content_type=content_type)
            
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
            
            # Upload in thread pool
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.client.upload_fileobj(
                    file,
                    self.bucket,
                    key,
                    ExtraArgs=extra_args
                )
            )
            
            # Generate public URL
            url = f"{self.public_url}/{key}"
            logger.info("file_uploaded", key=key, url=url)
            return url
            
        except ClientError as e:
            logger.error("upload_error", key=key, error=str(e))
            raise StorageException(f"Upload failed: {str(e)}")
    
    async def upload_file_path(self, file_path: str, key: str, content_type: Optional[str] = None) -> str:
        """Upload file from path to R2"""
        try:
            logger.info("uploading_file_from_path", path=file_path, key=key)
            
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
            
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.client.upload_file(
                    file_path,
                    self.bucket,
                    key,
                    ExtraArgs=extra_args
                )
            )
            
            url = f"{self.public_url}/{key}"
            logger.info("file_uploaded_from_path", key=key, url=url)
            return url
            
        except ClientError as e:
            logger.error("upload_from_path_error", path=file_path, error=str(e))
            raise StorageException(f"Upload failed: {str(e)}")
    
    async def delete_file(self, key: str):
        """Delete file from R2"""
        try:
            logger.info("deleting_file", key=key)
            
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.client.delete_object(Bucket=self.bucket, Key=key)
            )
            
            logger.info("file_deleted", key=key)
            
        except ClientError as e:
            logger.error("delete_error", key=key, error=str(e))
            raise StorageException(f"Delete failed: {str(e)}")
    
    async def delete_files(self, keys: list[str]):
        """Delete multiple files from R2"""
        try:
            logger.info("deleting_files", count=len(keys))
            
            objects = [{'Key': key} for key in keys]
            
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.client.delete_objects(
                    Bucket=self.bucket,
                    Delete={'Objects': objects}
                )
            )
            
            logger.info("files_deleted", count=len(keys))
            
        except ClientError as e:
            logger.error("delete_files_error", error=str(e))
            raise StorageException(f"Bulk delete failed: {str(e)}")
    
    async def get_presigned_url(self, key: str, expires_in: int = 3600) -> str:
        """Generate presigned URL for temporary access"""
        try:
            loop = asyncio.get_event_loop()
            url = await loop.run_in_executor(
                None,
                lambda: self.client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': self.bucket, 'Key': key},
                    ExpiresIn=expires_in
                )
            )
            
            logger.info("presigned_url_generated", key=key, expires_in=expires_in)
            return url
            
        except ClientError as e:
            logger.error("presigned_url_error", key=key, error=str(e))
            raise StorageException(f"Presigned URL failed: {str(e)}")
    
    async def file_exists(self, key: str) -> bool:
        """Check if file exists in R2"""
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.client.head_object(Bucket=self.bucket, Key=key)
            )
            return True
        except ClientError:
            return False

storage_service = StorageService()