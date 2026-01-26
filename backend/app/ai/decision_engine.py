import random
from typing import Dict, Any, Tuple
from ..nlp.nlp_analyzer import nlp_analyzer
from .student_agent import student_agent
from ..models import StudentState

class DecisionEngine:
    """
    Core logic to decide what the student does.
    Combines NLP analysis + Student State -> Action/Response.
    """
    
    def __init__(self):
        self.nlp = nlp_analyzer
        self.agent = student_agent
        
    def process_input(self, teacher_id: str, student_id: str, text: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        """
        Process teacher input and return decision + meta info.
        """
        # 1. Analyse Input
        nlp_result = self.nlp.analyze_text(text)
        intent = nlp_result["intent"]
        confidence = nlp_result["confidence"]
        
        # 2. Get Student State (Context)
        state = self.agent.get_state(student_id)
        
        # 3. Determine Response Logic
        response_options = self.nlp.kb.get_potential_responses(intent)
        
        # 4. State-Dependent Selection (Simple logic)
        # If student is sleepy, they might ignore instructions or respond lazily
        # If student is happy/attentive, they respond positively
        
        selected_response = random.choice(response_options)
        
        # Override logic example:
        if state.mood == "sleepy" and intent == "greeting":
             selected_response = {"text": "Mhmm... Günaydın...", "animation": "sleepy_yawn", "emotion": "sleepy"}
             
        # 5. Update State side-effects
        self._apply_state_effects(student_id, intent)
        
        # 6. Final Decision Payload
        decision = {
            "animation": selected_response["animation"],
            "reply_text": selected_response["text"],
            "emotion": selected_response["emotion"],
            "confidence": confidence
        }
        
        meta = {
            "intent_detected": intent,
            "student_state": state.mood,
            "raw_nlp": nlp_result
        }
        
        return decision, meta

    def _apply_state_effects(self, student_id: str, intent: str):
        """Update student internals logic"""
        if intent == "praise":
            self.agent.update_state(student_id, interaction_quality=0.8, mood_change="happy")
        elif intent == "discipline":
            self.agent.update_state(student_id, interaction_quality=-0.5, mood_change="sad")
        elif intent == "question_expectation":
            self.agent.update_state(student_id, interaction_quality=0.2)
        elif intent == "greeting":
            self.agent.update_state(student_id, interaction_quality=0.1)

decision_engine = DecisionEngine()
