import google.generativeai as genai
from app.config import settings
import json
import asyncio
from typing import List, Dict

genai.configure(api_key=settings.GEMINI_API_KEY)

class GeminiService:
    def __init__(self):
        self.model_flash = genai.GenerativeModel('gemini-1.5-flash')
        self.model_pro = genai.GenerativeModel('gemini-1.5-pro')
    
    async def transcribe_audio(self, audio_path: str, language: str = "hi") -> List[Dict]:
        """Transcribe audio using Gemini with timestamps"""
        # Upload audio
        audio_file = genai.upload_file(audio_path)
        
        # Wait for processing
        while audio_file.state.name == "PROCESSING":
            await asyncio.sleep(2)
            audio_file = genai.get_file(audio_file.name)
        
        # Prompt for transcription
        prompt = f"""
        Transcribe this audio in {language} language.
        
        Return ONLY a JSON array with this exact format:
        [
          {{
            "start": 0.0,
            "end": 2.5,
            "text": "actual spoken words"
          }},
          {{
            "start": 2.5,
            "end": 5.0,
            "text": "next sentence"
          }}
        ]
        
        Rules:
        1. Each subtitle should be 10-15 words max
        2. Split at natural sentence breaks
        3. Include proper punctuation
        4. Fix grammar automatically
        5. Maintain speaker context
        6. Return ONLY valid JSON, no markdown
        """
        
        # Generate
        response = self.model_pro.generate_content([prompt, audio_file])
        
        # Parse JSON
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
        
        subtitles = json.loads(text)
        
        # Cleanup
        genai.delete_file(audio_file.name)
        
        return subtitles
    
    async def translate_subtitles(self, subtitles: List[Dict], source_lang: str, target_lang: str) -> List[Dict]:
        """Translate subtitles to another language"""
        prompt = f"""
        Translate these subtitles from {source_lang} to {target_lang}.
        {json.dumps(subtitles, ensure_ascii=False)}
        
        Rules:
        1. Maintain timing (start, end) exactly
        2. Translate text naturally
        3. Keep cultural context
        4. Return ONLY JSON array
        """
        
        response = self.model_flash.generate_content(prompt)
        text = response.text.strip()
        
        if text.startswith("```"):
            text = text[text.find("["):text.rfind("]")+1]
        
        return json.loads(text)

gemini_service = GeminiService()