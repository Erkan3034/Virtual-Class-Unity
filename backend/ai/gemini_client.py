import google.generativeai as genai
import os
from typing import Optional

class GeminiClient:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = None
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')

    def generate_response(self, prompt: str, context: str = "") -> Optional[str]:
        if not self.model:
            return None
        
        full_prompt = f"""
        You are an AI assistant in a virtual classroom. 
        Context from Knowledge Base: {context}
        
        Student/Teacher Input: {prompt}
        
        Provide a concise, helpful response as a student character.
        Keep it under 20 words.
        """
        
        try:
            response = self.model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return None

gemini_client = GeminiClient()
