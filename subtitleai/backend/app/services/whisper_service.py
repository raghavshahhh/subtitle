import whisper
import asyncio
from typing import List, Dict
from app.config import settings
from app.utils.logger import logger
from app.exceptions import TranscriptionException

class WhisperService:
    def __init__(self):
        self.model = None
        self.model_name = settings.WHISPER_MODEL
    
    def _load_model(self):
        """Lazy load Whisper model"""
        if self.model is None:
            logger.info("loading_whisper_model", model=self.model_name)
            self.model = whisper.load_model(self.model_name)
            logger.info("whisper_model_loaded", model=self.model_name)
    
    async def transcribe_audio(self, audio_path: str, language: str = "hi") -> List[Dict]:
        """Transcribe audio using Whisper with word-level timestamps"""
        try:
            self._load_model()
            
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                lambda: self.model.transcribe(
                    audio_path,
                    language=language,
                    word_timestamps=True,
                    verbose=False
                )
            )
            
            # Convert to subtitle format
            subtitles = []
            for segment in result.get("segments", []):
                subtitles.append({
                    "start": segment["start"],
                    "end": segment["end"],
                    "text": segment["text"].strip(),
                    "confidence": segment.get("confidence", 0.95)
                })
            
            logger.info(
                "whisper_transcription_complete",
                audio_path=audio_path,
                language=language,
                segments=len(subtitles)
            )
            
            return subtitles
            
        except Exception as e:
            logger.error("whisper_transcription_error", error=str(e))
            raise TranscriptionException(str(e))
    
    async def detect_language(self, audio_path: str) -> str:
        """Detect language from audio"""
        try:
            self._load_model()
            
            loop = asyncio.get_event_loop()
            audio = await loop.run_in_executor(
                None,
                whisper.load_audio,
                audio_path
            )
            
            audio = whisper.pad_or_trim(audio)
            mel = whisper.log_mel_spectrogram(audio).to(self.model.device)
            
            _, probs = self.model.detect_language(mel)
            detected_lang = max(probs, key=probs.get)
            
            logger.info("language_detected", language=detected_lang, confidence=probs[detected_lang])
            return detected_lang
            
        except Exception as e:
            logger.error("language_detection_error", error=str(e))
            return "en"  # Default to English

whisper_service = WhisperService()
