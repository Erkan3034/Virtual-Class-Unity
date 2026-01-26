from typing import Dict, List, Optional
import random

class KnowledgeBase:
    """
    A simple rule-based knowledge base for MVP.
    Maps keywords to intents and intents to potential responses.
    """
    
    def __init__(self):
        # Keyword to Intent Mapping (Turkish)
        self.keyword_map: Dict[str, str] = {
            "merhaba": "greeting",
            "selam": "greeting",
            "günaydın": "greeting",
            "nasılsın": "status_check",
            "anladın mı": "comprehension_check",
            "tekrar et": "request_repeat",
            "aferin": "praise",
            "harika": "praise",
            "yanlış": "correction",
            "sessiz": "discipline",
            "dinle": "attention_command",
            "soru": "question_expectation",
        }
        
        # Intent to Response Templates
        self.response_templates: Dict[str, List[Dict[str, str]]] = {
            "greeting": [
                {"text": "Merhaba öğretmenim!", "animation": "happy_wave", "emotion": "happy"},
                {"text": "Günaydın öğretmenim, derse hazırım.", "animation": "neutral_stand", "emotion": "neutral"},
            ],
            "status_check": [
                {"text": "Gayet iyiyim öğretmenim.", "animation": "happy_nod", "emotion": "happy"},
                {"text": "Biraz uykum var ama dinliyorum.", "animation": "sleepy_yawn", "emotion": "sleepy"},
            ],
            "comprehension_check": [
                {"text": "Evet, anladım öğretmenim.", "animation": "happy_nod", "emotion": "happy"},
                {"text": "Şu kısmı pek anlamadım...", "animation": "confused_scratch_head", "emotion": "confused"},
            ],
            "praise": [
                {"text": "Teşekkür ederim!", "animation": "excited_raise_hand", "emotion": "happy"},
                {"text": "Daha çok çalışacağım.", "animation": "happy_nod", "emotion": "motivated"},
            ],
            "discipline": [
                {"text": "Özür dilerim, hemen toparlanıyorum.", "animation": "neutral_stand", "emotion": "regretful"},
                {"text": "Tamam, dinliyorum.", "animation": "listening_pose", "emotion": "neutral"},
            ],
             "unknown": [
                {"text": "Hımmm... Tam emin olamadım.", "animation": "thinking_pose", "emotion": "neutral"},
                {"text": "Bunu tekrar edebilir misiniz?", "animation": "confused_look", "emotion": "confused"},
            ]
        }

    def find_intent(self, text: str) -> str:
        """Finds the intent based on keywords in the text."""
        text_lower = text.lower()
        for keyword, intent in self.keyword_map.items():
            if keyword in text_lower:
                return intent
        return "unknown"

    def get_potential_responses(self, intent: str) -> List[Dict[str, str]]:
        """Returns list of potential responses for an intent."""
        return self.response_templates.get(intent, self.response_templates["unknown"])

knowledge_base = KnowledgeBase()
