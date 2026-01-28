import time
import uuid
import random
from datetime import datetime
from typing import Dict, Any, Optional

from models.definitions import (
    TeacherInputRequest, AIResponse, AIResponseMeta, 
    DecisionTrace, StudentStateModel, UnityResponse
)
from nlp.nlp_analyzer import nlp_analyzer
from state.manager import state_manager
from ai.gemini_client import gemini_client


class DecisionPipeline:
    """
    Mandatory Hardcoded Flow Implementation:
    Input -> Context Builder -> NLP/Intent -> State Loader -> Rule Engine -> 
    AI Reasoning -> Decision Validator -> Response Builder -> Persistence -> Emit
    """

    def process(self, request: TeacherInputRequest) -> AIResponse:
        start_time_token = time.perf_counter()
        decision_id = str(uuid.uuid4())

        # 1. Context Builder
        context = self._build_context(request)

        # 2. NLP / Intent / Emotion Analyzer
        nlp_data = nlp_analyzer.analyze_text(request.content, context=context)
        intent = nlp_data["intent"]

        # 3. Student State Loader
        current_state = state_manager.get_student_state(request.student_id)
        if not current_state:
            current_state = state_manager.update_student_state(request.student_id, {})

        # 4. Rule Engine
        rule_result = self._apply_rules(intent, current_state)

        # 5. AI Reasoning (Simulation for now, designed for LLM swap)
        reasoning_result = self._ai_reasoning(nlp_data, current_state, rule_result)
        print(f"DEBUG: reasoning_result keys: {reasoning_result.keys()}")

        # 6. Decision Validator
        validated_decision = self._validate_decision(reasoning_result, current_state)
        print(f"DEBUG: validated_decision keys: {validated_decision.keys()}")

        # 7. Deterministic Response Builder
        response = self._build_deterministic_response(
            validated_decision, 
            decision_id, 
            request.source,
            start_time_token,
            current_state
        )




        # 8. State Persistence
        self._persist_state(request.student_id, validated_decision)

        # 9. Response Emit (handled by caller/WS manager)
        return response

    def _build_context(self, request: TeacherInputRequest) -> Dict[str, Any]:
        return {
            "teacher_action": request.teacher_action,
            "input_type": request.input_type,
            "source": request.source
        }

    def _apply_rules(self, intent: str, state: StudentStateModel) -> Dict[str, Any]:
        # Implementation of the "State Transition Table"
        updates = {"mood": "neutral", "attention_delta": 0.0, "energy_delta": 0.0}
        
        if intent == "praise":
            updates = {"mood": "happy", "attention_delta": 0.2, "energy_delta": 0.1}
        elif intent == "warn":
            updates = {"mood": "alert", "attention_delta": 0.3, "energy_delta": -0.05}
        elif intent == "ignore":
            updates = {"attention_delta": -0.1}
        
        return updates

    def _ai_reasoning(self, nlp: Dict[str, Any], state: StudentStateModel, rules: Dict[str, Any]) -> Dict[str, Any]:
        """Placeholder for LLM. Combines NLP intent + State + Rules into a student behavior."""
        # Simple simulation based on intent
        responses = {
            "praise": {"reply_text": "Teşekkürler öğretmenim!", "animation": "happy", "emotion": "happy"},
            "warn": {"reply_text": "Özür dilerim, dikkat ediyorum.", "animation": "alert", "emotion": "neutral"},
            "greeting": {"reply_text": "Merhaba!", "animation": "wave", "emotion": "happy"},
            "encourage": {"reply_text": "Daha çok çalışacağım!", "animation": "motivated", "emotion": "motivated"},
            "question": {"reply_text": "Hmm, düşüneyim...", "animation": "thinking", "emotion": "neutral"},
            "command_sit": {"reply_text": "Oturuyorum öğretmenim.", "animation": "sit", "emotion": "neutral"},
            "command_stand": {"reply_text": "Kalkıyorum öğretmenim.", "animation": "stand", "emotion": "neutral"},
            "ignore": {"reply_text": "...", "animation": "idle", "emotion": "neutral"},
            "unknown": {"reply_text": "...", "animation": "confused", "emotion": "confused"}
        }

        
        intent = nlp["intent"]
        # Use a copy to avoid modifying the original response templates
        behavior = responses.get(intent, responses["unknown"]).copy()
        
        # 1. AI Fallback for Unknown or Complex Queries (Groq > Gemini)
        if intent == "unknown" or intent == "question":
            from nlp.knowledge_base import knowledge_base
            from ai.groq_client import groq_client
            kb_context = knowledge_base.get_all_topics() # RAG: Get context from KB
            
            # Try Groq first (faster and more reliable), fallback to Gemini
            ai_reply = groq_client.generate_response(nlp["raw_text"], context=str(kb_context))
            if not ai_reply:
                ai_reply = gemini_client.generate_response(nlp["raw_text"], context=str(kb_context))
            
            if ai_reply:
                behavior["reply_text"] = ai_reply
                behavior["animation"] = "thinking_pose"
                behavior["emotion"] = "motivated"


        # Safe access to ensure we don't get KeyError
        return {
            "intent": intent, # Ensure intent is passed through
            "reply_text": behavior.get("reply_text", "..."),
            "animation": behavior.get("animation", "confused"),
            "emotion": behavior.get("emotion", "confused"),
            "confidence": nlp.get("confidence", 0.5),
            "updates": rules,
            "raw_input": nlp.get("raw_text")
        }



    def _validate_decision(self, decision: Dict[str, Any], state: StudentStateModel) -> Dict[str, Any]:
        # Coherence Check: Can't dance while sleeping
        if state.mood == "sleepy" and decision["animation"] not in ["sleepy", "yawn"]:
            decision["animation"] = "sleepy"
            decision["reply_text"] = "Zzz..."
        
        return decision

    def _build_deterministic_response(self, decision: Dict[str, Any], d_id: str, source: str, start_time: float, state: StudentStateModel) -> AIResponse:
        latency = int((time.perf_counter() - start_time) * 1000)
        
        # Include actual student state data in trace
        state_data = {
            "mood": state.mood,
            "attention_level": state.attention_level,
            "energy_level": state.energy_level,
            "current_activity": state.current_activity
        }
        
        trace = DecisionTrace(
            intent=decision.get("intent", "unknown"),
            rule_applied="primary_logic",
            state_before=state_data,
            state_after=state_data  # Updated after persist
        )

        # Map mood to student state
        mood_to_state = {
            "happy": "attentive",
            "neutral": "attentive", 
            "sad": "confused",
            "sleepy": "sleepy",
            "confused": "confused",
            "motivated": "attentive",
            "alert": "attentive"
        }

        return AIResponse(
            animation=decision["animation"],
            reply_text=decision["reply_text"],
            emotion=decision["emotion"],
            confidence=decision["confidence"],
            student_state=mood_to_state.get(state.mood, "idle"),
            decision_trace=trace,
            meta=AIResponseMeta(
                timestamp=datetime.now().isoformat(),
                source=source,
                latency_ms=latency,
                decision_id=d_id,
                transcribed_text=decision.get("raw_input") or decision.get("reply_text") # Full context or fallback
            )
        )


    def _persist_state(self, student_id: str, decision: Dict[str, Any]):
        updates = decision.get("updates", {})
        state_manager.update_student_state(student_id, updates)

pipeline = DecisionPipeline()
