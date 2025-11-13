import ffmpeg
import requests
import tempfile
import os
import asyncio
from typing import Optional
from app.services.storage_service import storage_service
from app.utils.logger import logger
from app.exceptions import ProcessingException

class AudioService:
    async def extract_audio(self, video_url: str, output_path: str, enhance: bool = True):
        """Extract audio from video using FFmpeg"""
        temp_video_path = None
        try:
            logger.info("extracting_audio", video_url=video_url)
            
            # Download video to temp file
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_video:
                response = requests.get(video_url, stream=True, timeout=30)
                response.raise_for_status()
                
                for chunk in response.iter_content(chunk_size=8192):
                    temp_video.write(chunk)
                temp_video_path = temp_video.name
            
            # Extract audio with enhancement
            stream = ffmpeg.input(temp_video_path)
            
            if enhance:
                # Apply audio filters
                stream = (
                    stream
                    .filter('highpass', f=200)  # Remove low frequency noise
                    .filter('lowpass', f=8000)  # Remove high frequency noise
                    .filter('afftdn', nf=-25)  # Noise reduction
                    .filter('loudnorm', I=-16, TP=-1.5, LRA=11)  # Normalize loudness
                )
            
            stream = stream.output(
                output_path,
                acodec='pcm_s16le',
                ac=1,  # mono
                ar=16000  # 16kHz sample rate for Whisper
            )
            
            # Run in thread pool
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: stream.overwrite_output().run(quiet=True, capture_stderr=True)
            )
            
            logger.info("audio_extracted", output_path=output_path)
            
        except Exception as e:
            logger.error("audio_extraction_error", error=str(e))
            raise ProcessingException(f"Audio extraction failed: {str(e)}")
        finally:
            if temp_video_path and os.path.exists(temp_video_path):
                os.unlink(temp_video_path)
    
    async def get_duration(self, video_url: str) -> float:
        """Get video duration in seconds"""
        try:
            loop = asyncio.get_event_loop()
            probe = await loop.run_in_executor(
                None,
                ffmpeg.probe,
                video_url
            )
            
            duration = float(probe['streams'][0]['duration'])
            logger.info("video_duration", duration=duration)
            return duration
            
        except Exception as e:
            logger.error("duration_extraction_error", error=str(e))
            raise ProcessingException(f"Duration extraction failed: {str(e)}")
    
    async def get_video_info(self, video_url: str) -> dict:
        """Get comprehensive video information"""
        try:
            loop = asyncio.get_event_loop()
            probe = await loop.run_in_executor(
                None,
                ffmpeg.probe,
                video_url
            )
            
            video_stream = next(
                (s for s in probe['streams'] if s['codec_type'] == 'video'),
                None
            )
            
            if not video_stream:
                raise ProcessingException("No video stream found")
            
            info = {
                'duration': float(probe['format']['duration']),
                'size': int(probe['format']['size']),
                'width': int(video_stream['width']),
                'height': int(video_stream['height']),
                'fps': eval(video_stream['r_frame_rate']),
                'codec': video_stream['codec_name']
            }
            
            logger.info("video_info_extracted", **info)
            return info
            
        except Exception as e:
            logger.error("video_info_error", error=str(e))
            raise ProcessingException(f"Video info extraction failed: {str(e)}")

audio_service = AudioService()