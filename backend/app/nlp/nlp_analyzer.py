from typing import Dict, Any
from .knowledge_base import knowledge_base

class NLPAnalyzer:
    """
    Analyzes student/teacher text input.
    Currently uses a rule-based approach via KnowledgeBase.
    Designed to be extended with LLMs/RAG in the future.
    """
    
    def __init__(self):
        self.kb = knowledge_base
        
    def analyze_text(self, text: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Analyzes the input text and returns structured data.
        """
        # 1. Intent Detection
        intent = self.kb.find_intent(text)
        
        # 2. Entity Extraction (Placeholder for future)
        entities = []
        
        # 3. Sentiment Analysis (Basic placeholder)
        sentiment = "neutral"
        if intent in ["praise", "greeting"]:
            sentiment = "positive"
        elif intent in ["discipline", "correction"]:
            sentiment = "negative"
            
        return {
            "intent": intent,
            "entities": entities,
            "sentiment": sentiment,
            "raw_text": text,
            "confidence": 0.9 if intent != "unknown" else 0.4
        }

nlp_analyzer = NLPAnalyzer()
