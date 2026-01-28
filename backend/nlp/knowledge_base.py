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
            "otur": "command_sit",
            "kalk": "command_stand",
            "ayağa": "command_stand",
            "yerine": "command_sit",
            "sessiz": "discipline",
            "sus": "discipline",
        }
        
        # Intent to Response Templates
        self.response_templates: Dict[str, List[Dict[str, str]]] = {
            "greeting": [
                {"reply_text": "Merhaba öğretmenim!", "animation": "happy_wave", "emotion": "happy"},
                {"reply_text": "Günaydın öğretmenim, derse hazırım.", "animation": "neutral_stand", "emotion": "neutral"},
            ],
            "status_check": [
                {"reply_text": "Gayet iyiyim öğretmenim.", "animation": "happy_nod", "emotion": "happy"},
                {"reply_text": "Biraz uykum var ama dinliyorum.", "animation": "sleepy_yawn", "emotion": "sleepy"},
            ],
            "comprehension_check": [
                {"reply_text": "Evet, anladım öğretmenim.", "animation": "happy_nod", "emotion": "happy"},
                {"reply_text": "Şu kısmı pek anlamadım...", "animation": "confused_scratch_head", "emotion": "confused"},
            ],
            "praise": [
                {"reply_text": "Teşekkür ederim!", "animation": "excited_raise_hand", "emotion": "happy"},
                {"reply_text": "Daha çok çalışacağım.", "animation": "happy_nod", "emotion": "motivated"},
            ],
            "discipline": [
                {"reply_text": "Özür dilerim, hemen toparlanıyorum.", "animation": "neutral_stand", "emotion": "regretful"},
                {"reply_text": "Tamam, dinliyorum.", "animation": "listening_pose", "emotion": "neutral"},
            ],
            "command_sit": [
                {"reply_text": "Oturuyorum öğretmenim.", "animation": "sit", "emotion": "neutral"},
            ],
            "command_stand": [
                {"reply_text": "Kalkıyorum öğretmenim.", "animation": "stand", "emotion": "neutral"},
            ],
             "unknown": [
                {"reply_text": "Hımmm... Tam emin olamadım.", "animation": "thinking_pose", "emotion": "neutral"},
                {"reply_text": "Bunu tekrar edebilir misiniz?", "animation": "confused_look", "emotion": "confused"},
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

    def get_all_topics(self) -> List[str]:
        """Returns a list of all keywords/topics currently in the knowledge base."""
        return list(self.keyword_map.keys())

knowledge_base = KnowledgeBase()
