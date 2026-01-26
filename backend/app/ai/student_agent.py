from typing import Dict
from ..models import StudentState
import time

class StudentAgent:
    """
    Manages the state and behavior of a student agent.
    """
    
    def __init__(self):
        # In-memory storage for MVP
        self._states: Dict[str, StudentState] = {}
        
    def get_state(self, student_id: str) -> StudentState:
        """Get current state of a student, create default if not exists."""
        if student_id not in self._states:
            self._states[student_id] = StudentState()
        return self._states[student_id]
        
    def update_state(self, student_id: str, 
                    interaction_quality: float = 0.0,
                    mood_change: str = None) -> StudentState:
        """
        Update student state based on interaction.
        interaction_quality: -1.0 to 1.0 (negative for scolding, positive for praise)
        """
        state = self.get_state(student_id)
        
        # Simple logical updates
        if mood_change:
            state.mood = mood_change
            
        # Update attention based on quality
        if interaction_quality > 0:
            state.attention_level = min(1.0, state.attention_level + 0.1)
            state.energy_level = min(1.0, state.energy_level + 0.05)
        elif interaction_quality < 0:
            state.attention_level = max(0.0, state.attention_level - 0.2)
            # Mood might drop
            if state.mood == "happy":
                state.mood = "neutral"
                
        # Timestamp
        state.last_interaction_timestamp = time.strftime("%Y-%m-%dT%H:%M:%S%z")
        
        self._states[student_id] = state
        return state

    def reset_state(self, student_id: str):
        self._states[student_id] = StudentState()

student_agent = StudentAgent()
