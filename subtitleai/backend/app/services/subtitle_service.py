import google.generativeai as genai
from app.config import settings
import json

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_subtitles_with_gemini(video_path: str, language: str = "hi") -> list:
    """Generate subtitles using Gemini AI (mock for now)"""
    
    # Mock subtitle generation for demo
    if language == "hi":
        subtitles = [
            {"start_time": 0.0, "end_time": 3.0, "text": "नमस्ते, SubtitleAI में आपका स्वागत है"},
            {"start_time": 3.0, "end_time": 6.0, "text": "यह AI द्वारा बनाए गए सबटाइटल का डेमो है"},
            {"start_time": 6.0, "end_time": 9.0, "text": "आप अपना वीडियो अपलोड कर सकते हैं"},
            {"start_time": 9.0, "end_time": 12.0, "text": "और तुरंत सबटाइटल जेनरेट कर सकते हैं"}
        ]
    else:
        subtitles = [
            {"start_time": 0.0, "end_time": 3.0, "text": "Welcome to SubtitleAI"},
            {"start_time": 3.0, "end_time": 6.0, "text": "This is a demo of AI-generated subtitles"},
            {"start_time": 6.0, "end_time": 9.0, "text": "You can upload your video"},
            {"start_time": 9.0, "end_time": 12.0, "text": "And generate subtitles instantly"}
        ]
    
    return subtitles

def generate_subtitles_with_whisper(video_path: str, language: str = "hi") -> list:
    """Generate subtitles using Whisper (mock for now)"""
    return generate_subtitles_with_gemini(video_path, language)
