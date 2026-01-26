from typing import Dict
from datetime import datetime
from ..models import StudentStateModel, EmotionType

class StudentAgent:
    """
    Manages the state and behavior of a student agent.
    Acts as the 'Database' layer for student states in this MVP.
    """
    
    def __init__(self):
        self._states: Dict[str, StudentStateModel] = {}
        
    def get_state(self, student_id: str) -> StudentStateModel:
        """Get current state of a student, create default if not exists."""
        if student_id not in self._states:
            self._states[student_id] = StudentStateModel(
                student_id=student_id,
                mood="neutral",
                attention_level=0.8,
                energy_level=0.8,
                current_activity="listening",
                last_updated=datetime.now()
            )
        return self._states[student_id]
        
    def update_state(self, student_id: str, 
                    attention_delta: float = 0.0,
                    energy_delta: float = 0.0,
                    mood: EmotionType = None,
                    activity: str = None) -> StudentStateModel:
        """
        Update student state based on interaction inputs.
        """
        state = self.get_state(student_id)
        
        # 1. Update numeric stats (clamped 0.0 - 1.0)
        state.attention_level = max(0.0, min(1.0, state.attention_level + attention_delta))
        state.energy_level = max(0.0, min(1.0, state.energy_level + energy_delta))
        
        # 2. Update categorical stats
        if mood:
            state.mood = mood
        if activity:
            state.current_activity = activity
            
        # 3. Automatic mood decay/shift logic (Rule-based simple AI)
        if state.energy_level < 0.3 and state.mood not in ["sleepy", "sad"]:
            state.mood = "sleepy"
        elif state.attention_level < 0.3 and state.mood == "neutral":
            state.mood = "confused"
            
        state.last_updated = datetime.now()
        self._states[student_id] = state
        return state

    def reset_state(self, student_id: str):
        if student_id in self._states:
            del self._states[student_id]
        self.get_state(student_id)

student_agent = StudentAgent()

