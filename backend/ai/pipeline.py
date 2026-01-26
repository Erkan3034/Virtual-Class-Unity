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

        # 6. Decision Validator
        validated_decision = self._validate_decision(reasoning_result, current_state)

        # 7. Deterministic Response Builder
        response = self._build_deterministic_response(
            validated_decision, 
            decision_id, 
            request.source,
            start_time_token
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
            "praise": {"text": "Teşekkürler öğretmenim!", "anim": "happy", "emo": "happy"},
            "warn": {"text": "Özür dilerim, dikkat ediyorum.", "anim": "alert", "emo": "neutral"},
            "greeting": {"text": "Merhaba!", "anim": "wave", "emo": "happy"},
            "unknown": {"text": "...", "anim": "confused", "emo": "confused"}
        }
        
        behavior = responses.get(nlp["intent"], responses["unknown"])
        return {
            "reply_text": behavior["text"],
            "animation": behavior["anim"],
            "emotion": behavior["emo"],
            "confidence": nlp.get("confidence", 0.5),
            "updates": rules
        }

    def _validate_decision(self, decision: Dict[str, Any], state: StudentStateModel) -> Dict[str, Any]:
        # Coherence Check: Can't dance while sleeping
        if state.mood == "sleepy" and decision["animation"] not in ["sleepy", "yawn"]:
            decision["animation"] = "sleepy"
            decision["reply_text"] = "Zzz..."
        
        return decision

    def _build_deterministic_response(self, decision: Dict[str, Any], d_id: str, source: str, start_time: float) -> AIResponse:
        latency = int((time.perf_counter() - start_time) * 1000)
        
        trace = DecisionTrace(
            intent=decision.get("intent", "unknown"),
            rule_applied="primary_logic",
            state_before={}, # Simplified for now
            state_after={}
        )

        return AIResponse(
            animation=decision["animation"],
            reply_text=decision["reply_text"],
            emotion=decision["emotion"],
            confidence=decision["confidence"],
            student_state="attentive", # Map from state later
            decision_trace=trace,
            meta=AIResponseMeta(
                timestamp=datetime.now().isoformat(),
                source=source,
                latency_ms=latency,
                decision_id=d_id
            )
        )

    def _persist_state(self, student_id: str, decision: Dict[str, Any]):
        updates = decision.get("updates", {})
        state_manager.update_student_state(student_id, updates)

pipeline = DecisionPipeline()
