from groq import Groq
from typing import Optional
from core.config import settings

class GroqClient:
    """Groq API client for fast, free AI responses."""
    
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY if hasattr(settings, 'GROQ_API_KEY') else None
        self.client = None
        if self.api_key:
            self.client = Groq(api_key=self.api_key)
            print("Groq API initialized successfully!")
        else:
            print("WARNING: GROQ_API_KEY not found. AI fallback disabled.")

    def generate_response(self, prompt: str, context: str = "") -> Optional[str]:
        if not self.client:
            return None
        
        full_prompt = f"""Sen sanal bir sınıfta öğrenci karakterisin.
Bağlam: {context}

Öğretmen/Kullanıcı Mesajı: {prompt}

Kısa ve doğal bir öğrenci yanıtı ver. Maksimum 20 kelime kullan. Türkçe yanıt ver."""
        
        try:
            response = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",  # Fast and free
                messages=[
                    {"role": "system", "content": "Sen sanal bir sınıfta meraklı ve dikkatli bir öğrencisin. Kısa ve doğal yanıtlar ver."},
                    {"role": "user", "content": full_prompt}
                ],
                max_tokens=100,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Groq API Error (Chat): {e}")
            return None

    def transcribe_audio(self, audio_file_path: str) -> Optional[str]:
        """Transcribe audio using Whisper-large-v3 model."""
        if not self.client:
            return None
        
        try:
            with open(audio_file_path, "rb") as file:
                transcription = self.client.audio.transcriptions.create(
                    file=(audio_file_path, file.read()),
                    model="whisper-large-v3",
                    prompt="Sanal sınıf ortamında Türkçe konuşma.", # Prompt for better Turkish context
                    response_format="text",
                    language="tr"
                )
            return str(transcription).strip()
        except Exception as e:
            print(f"Groq API Error (STT): {e}")
            return None

groq_client = GroqClient()
