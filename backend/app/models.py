from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Literal

# Input Models
class TeacherInputRequest(BaseModel):
    teacher_id: str = Field(..., description="ID of the teacher sending the command")
    student_id: str = Field(..., description="ID of the target student")
    input_type: Literal["text", "voice"] = Field("text", description="Type of input: text or voice")
    content: str = Field(..., description="The actual text content or command")

# State Models
class StudentState(BaseModel):
    mood: str = "neutral"  # happy, sad, confused, etc.
    attention_level: float = 1.0  # 0.0 to 1.0
    energy_level: float = 1.0  # 0.0 to 1.0
    current_activity: str = "listening"
    last_interaction_timestamp: Optional[str] = None

# Response Models
class AIResponseMeta(BaseModel):
    student_state: str
    intent_detected: str
    timestamp: str
    processing_time_ms: Optional[float] = None
    debug_info: Optional[Dict[str, Any]] = None

class AIResponse(BaseModel):
    animation: str = Field(..., description="Name of the animation to trigger in Unity")
    reply_text: str = Field(..., description="Text response from the student")
    emotion: str = Field(..., description="Emotion tag for facial expressions")
    confidence: float = Field(..., description="Confidence score of the decision (0-1)")
    meta: AIResponseMeta = Field(..., description="Metadata for debugging and logging")
