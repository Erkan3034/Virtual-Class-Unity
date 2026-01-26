from datetime import datetime
from threading import current_thread
from typing import Dict, Any
from ..models import AIResponse, AIResponseMeta

class ResponseBuilder:
    """
    Constructs the standard API response for Unity and Frontend.
    """
    
    @staticmethod
    def build_response(decision: Dict[str, Any], meta_info: Dict[str, Any]) -> AIResponse:
        """
        Creates a clear, strictly typed response object.
        """
        meta = AIResponseMeta(
            student_state=meta_info.get("student_state", "unknown"),
            intent_detected=meta_info.get("intent_detected", "unknown"),
            timestamp=datetime.now().isoformat(),
            debug_info=meta_info.get("raw_nlp")
        )
        
        return AIResponse(
            animation=decision["animation"],
            reply_text=decision["reply_text"],
            emotion=decision["emotion"],
            confidence=decision["confidence"],
            meta=meta
        )

response_builder = ResponseBuilder()
