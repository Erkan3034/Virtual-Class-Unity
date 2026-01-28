from typing import Dict, Optional, Any
from datetime import datetime
import json
from models.definitions import StudentStateModel, EmotionType
from core.config import settings

class StateManager:
    """
    Manages student states with Redis-ready architecture.
    Uses an in-memory dictionary for this implementation as requested,
    but designed to be easily swapped for Redis.
    """
    
    def __init__(self):
        self._local_storage: Dict[str, str] = {} # Simulating Redis key-value storage

    def _get_key(self, student_id: int) -> str:
        return f"student:state:{student_id}"

    def get_student_state(self, student_id: int) -> Optional[StudentStateModel]:
        key = self._get_key(student_id)
        data = self._local_storage.get(key)
        if not data:
            return None
        return StudentStateModel.model_validate_json(data)

    def set_student_state(self, student_id: int, state: StudentStateModel):
        key = self._get_key(student_id)
        state.last_updated = datetime.now()
        self._local_storage[key] = state.model_dump_json()

    def update_student_state(self, student_id: int, updates: Dict[str, Any]) -> StudentStateModel:
        state = self.get_student_state(student_id)
        if not state:
            # Initialize default state with required fields
            state = StudentStateModel(
                student_id=student_id,
                mood="neutral",
                attention_level=0.8,
                energy_level=0.8,
                current_activity="listening",
                last_updated=datetime.now(),
                personality_traits={"type": "balanced"}
            )
        
        # Apply updates
        state_dict = state.model_dump()
        for k, v in updates.items():
            if k in state_dict:
                state_dict[k] = v
        
        # Clamping
        state_dict["attention_level"] = max(0.0, min(1.0, state_dict["attention_level"]))
        state_dict["energy_level"] = max(0.0, min(1.0, state_dict["energy_level"]))
        
        updated_state = StudentStateModel(**state_dict)
        self.set_student_state(student_id, updated_state)
        return updated_state

    def acquire_lock(self, student_id: int, duration_ms: int = 2000) -> bool:
        """Simple mutex simulation for teacher overrides."""
        # In Redis: SET key val NX PX duration_ms
        return True # Simplified for this version

state_manager = StateManager()
