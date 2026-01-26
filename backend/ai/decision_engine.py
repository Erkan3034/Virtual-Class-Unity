import random
from typing import Dict, Any, Tuple
from datetime import datetime
from nlp.nlp_analyzer import nlp_analyzer
from .student_agent import student_agent
from models.definitions import (
    TeacherInputRequest, AIResponse, AIResponseMeta, 
    DecisionTrace, StudentStateModel, EmotionType
)

class DecisionEngine:
    """
    Core logic to decide what the student does.
    Combines NLP analysis + Student State -> Action/Response.
    """
    
    def __init__(self):
        self.nlp = nlp_analyzer
        self.agent = student_agent
        
    def process_request(self, request: TeacherInputRequest) -> AIResponse:
        """
        Main pipeline: Request -> NLP -> State -> Logic -> Response
        """
        # 1. Pipeline Start
        start_time = datetime.now().isoformat()
        
        # 2. Analyze Input (with override context)
        nlp_context = {"teacher_action": request.teacher_action}
        nlp_result = self.nlp.analyze_text(request.content, context=nlp_context)
        intent = nlp_result["intent"]
        confidence = nlp_result["confidence"]
        
        # 3. Get Student State (Before interaction)
        student_id = request.student_id
        state_before = self.agent.get_state(student_id).model_copy()
        
        # 4. Determine Response Logic
        response_options = self.nlp.kb.get_potential_responses(intent)
        selected_response = random.choice(response_options)
        
        # 5. Apply Logic & State Updates (The "Brain")
        # Initialize default updates
        mood_update = None
        attn_update = 0.0
        energy_update = 0.0
        rule_id = "default_response"
        
        # Logic Rules
        if intent == "praise":
            mood_update = "happy"
            attn_update = 0.1
            energy_update = 0.1
            rule_id = "praise_effect"
        elif intent in ["discipline", "warn"]:
            mood_update = "sad" if state_before.mood != "disruptive" else "regretful"
            attn_update = 0.2
            rule_id = "discipline_effect"
        elif intent == "greeting":
            mood_update = "happy"
            attn_update = 0.05
            rule_id = "greeting_effect"
            
        # State-dependent overrides (e.g. Sleepy student yields distinct response)
        if state_before.mood == "sleepy" and intent not in ["discipline", "warn"]:
             selected_response = {"reply_text": "Mhmm... (esner)... Tamam...", "animation": "sleepy_yawn", "emotion": "sleepy"}
             rule_id = "sleepy_override"

        
        # 6. Commit State Updates
        state_after = self.agent.update_state(
            student_id=student_id,
            attention_delta=attn_update,
            energy_delta=energy_update,
            mood=mood_update
        )
        
        # 7. Construct Trace
        trace = DecisionTrace(
            intent=intent,
            rule_applied=rule_id,
            state_before=state_before.model_dump(),
            state_after=state_after.model_dump()
        )
        
        # 8. Build Final Response
        return AIResponse(
            animation=selected_response["animation"],
            reply_text=selected_response["reply_text"],
            emotion=selected_response["emotion"], # potentially override from logic

            confidence=confidence,
            student_state=self._map_mood_to_state(state_after.mood),
            decision_trace=trace,
            meta=AIResponseMeta(
                timestamp=datetime.now().isoformat(),
                source=request.source
            )
        )

    def _map_mood_to_state(self, mood: str) -> str:
        """Helper to map detailed mood to high-level state"""
        map_ = {
            "happy": "attentive",
            "neutral": "attentive",
            "sad": "confused", 
            "sleepy": "sleepy",
            "confused": "confused",
            "regretful": "attentive"
        }
        return map_.get(mood, "idle")

decision_engine = DecisionEngine()

