from typing import Dict, Any, Optional
from .knowledge_base import knowledge_base

class NLPAnalyzer:
    """
    Analyzes student/teacher text input.
    Currently uses a rule-based approach via KnowledgeBase.
    Designed to be extended with LLMs/RAG in the future.
    """
    
    def __init__(self):
        self.kb = knowledge_base
        
    def analyze_text(self, text: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Analyzes the input text and returns structured data.
        Prioritizes explicit 'teacher_action' from context if available.
        """
        context = context or {}
        explicit_action = context.get('teacher_action')

        # 1. Intent Detection
        # If explicit action is provided (e.g. button click), use it as intent
        if explicit_action:
            intent = explicit_action
            confidence = 1.0
        else:
            intent = self.kb.find_intent(text)
            confidence = 0.9 if intent != "unknown" else 0.4
        
        # 2. Entity Extraction (Placeholder for future)
        entities = []
        
        # 3. Sentiment Analysis (Basic placeholder)
        sentiment = "neutral"
        if intent in ["praise", "greeting", "encourage"]:
            sentiment = "positive"
        elif intent in ["discipline", "correction", "warn"]:
            sentiment = "negative"
            
        return {
            "intent": intent,
            "entities": entities,
            "sentiment": sentiment,
            "raw_text": text,
            "confidence": confidence
        }

nlp_analyzer = NLPAnalyzer()

