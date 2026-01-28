import google.generativeai as genai
from typing import Optional
from core.config import settings

class GeminiClient:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = None
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('models/gemini-2.0-flash')
            print(f"Gemini API initialized successfully!")


        else:
            print("WARNING: GEMINI_API_KEY not found. AI fallback disabled.")


    def generate_response(self, prompt: str, context: str = "", structured: bool = False) -> Optional[str]:
        if not self.model:
            return None
        
        if structured:
            system_instruction = """Sen sanal bir sınıfta meraklı ve dikkatli bir öğrencisin. 
Yanıtını MUTLAKA aşağıdaki JSON formatında ver:
{
  "reply_text": "yanıt metni",
  "animation": "animasyon_adı",
  "emotion": "duygu_adı"
}
Kullanabileceğin Animasyonlar: sit, stand, wave, thinking_pose, happy_nod, confused_look, listening_pose.
Kullanabileceğin Duygular: neutral, happy, sad, confused, sleepy, alert, motivated, regretful.
Yanıtın kısa, doğal ve Türkçe olsun."""
        else:
            system_instruction = "Sen sanal bir sınıfta meraklı ve dikkatli bir öğrencisin. Kısa ve doğal yanıtlar ver. Türkçe yanıt ver."

        full_prompt = f"Bağlam: {context}\n\nÖğretmen/Kullanıcı Mesajı: {prompt}"
        
        try:
            generation_config = {
                "response_mime_type": "application/json"
            } if structured else {}
            
            response = self.model.generate_content(
                f"{system_instruction}\n\n{full_prompt}",
                generation_config=generation_config
            )
            return response.text
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return None

gemini_client = GeminiClient()
