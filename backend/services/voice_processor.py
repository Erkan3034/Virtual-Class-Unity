import base64
import os
import tempfile
import uuid
from typing import Optional
from ai.groq_client import groq_client

class VoiceProcessor:
    """Service to handle voice data processing (Decoding Base64, Temp storage, STT trigging)."""

    def process_base64_audio(self, base64_data: str, extension: str = "wav") -> Optional[str]:
        """
        Decodes base64 audio data, saves to a temporary file, transcribes it, and cleans up.
        """
        try:
            # 1. Clean base64 data (remove header if present)
            if "," in base64_data:
                base64_data = base64_data.split(",")[1]

            # 2. Decode
            audio_bytes = base64.b64decode(base64_data)

            # 3. Save to temp file
            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{extension}") as temp_audio:
                temp_audio.write(audio_bytes)
                temp_path = temp_audio.name

            # 4. Transcribe using Groq
            print(f"DEBUG: Transcribing audio file: {temp_path}")
            text = groq_client.transcribe_audio(temp_path)

            # 5. Clean up
            if os.path.exists(temp_path):
                os.remove(temp_path)

            return text

        except Exception as e:
            print(f"VoiceProcessor Error: {e}")
            return None

voice_processor = VoiceProcessor()
