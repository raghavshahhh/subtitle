from typing import List
from app.models.subtitle import Subtitle
import tempfile
import ffmpeg
import os

class SubtitleFormatter:
    def to_srt(self, subtitles: List[Subtitle]) -> str:
        """Convert subtitles to SRT format"""
        srt_content = []
        
        for i, subtitle in enumerate(subtitles, 1):
            start_time = self._seconds_to_srt_time(subtitle.start_time)
            end_time = self._seconds_to_srt_time(subtitle.end_time)
            
            srt_content.append(f"{i}")
            srt_content.append(f"{start_time} --> {end_time}")
            srt_content.append(subtitle.text)
            srt_content.append("")  # Empty line
        
        return "\n".join(srt_content)
    
    def to_vtt(self, subtitles: List[Subtitle]) -> str:
        """Convert subtitles to WebVTT format"""
        vtt_content = ["WEBVTT", ""]
        
        for subtitle in subtitles:
            start_time = self._seconds_to_vtt_time(subtitle.start_time)
            end_time = self._seconds_to_vtt_time(subtitle.end_time)
            
            vtt_content.append(f"{start_time} --> {end_time}")
            vtt_content.append(subtitle.text)
            vtt_content.append("")
        
        return "\n".join(vtt_content)
    
    async def burn_subtitles(self, video_url: str, subtitles: List[Subtitle], style: dict) -> str:
        """Burn subtitles into video using FFmpeg"""
        # Create SRT file
        srt_content = self.to_srt(subtitles)
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.srt', delete=False) as srt_file:
            srt_file.write(srt_content)
            srt_path = srt_file.name
        
        # Output video path
        output_path = tempfile.mktemp(suffix='.mp4')
        
        try:
            # FFmpeg subtitle filter
            subtitle_filter = f"subtitles={srt_path}:force_style='FontName={style.get('font', 'Arial')},FontSize={style.get('size', 24)},PrimaryColour={style.get('color', '&HFFFFFF')},Alignment={style.get('position', '2')}'"
            
            (
                ffmpeg
                .input(video_url)
                .filter('subtitles', srt_path, 
                       force_style=f"FontName={style.get('font', 'Arial')},FontSize={style.get('size', 24)}")
                .output(output_path, vcodec='libx264', acodec='aac')
                .overwrite_output()
                .run(quiet=True)
            )
            
            return output_path
            
        except Exception as e:
            raise Exception(f"Subtitle burning failed: {str(e)}")
        finally:
            os.unlink(srt_path)
    
    def _seconds_to_srt_time(self, seconds: float) -> str:
        """Convert seconds to SRT time format (HH:MM:SS,mmm)"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millisecs = int((seconds % 1) * 1000)
        
        return f"{hours:02d}:{minutes:02d}:{secs:02d},{millisecs:03d}"
    
    def _seconds_to_vtt_time(self, seconds: float) -> str:
        """Convert seconds to VTT time format (HH:MM:SS.mmm)"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millisecs = int((seconds % 1) * 1000)
        
        return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millisecs:03d}"