from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Literal
from datetime import datetime

# --- Enums (defined as Literals for simplicity in JSON) ---
TeacherActionType = Literal["warn", "praise", "command_sit", "command_stand", "ignore", "encourage", "question"]
InputSourceType = Literal["unity", "web"]
InputTypeType = Literal["text", "voice"]
EmotionType = Literal["neutral", "happy", "sad", "confused", "sleepy", "alert", "motivated", "regretful"]
StudentStateType = Literal["attentive", "sleepy", "confused", "successful", "idle", "disruptive"]

# --- Input Models ---
class TeacherInputRequest(BaseModel):
    source: InputSourceType = Field("unity", description="Source of the request")
    teacher_id: str = Field(..., description="ID of the teacher sending the command")
    student_id: str = Field(..., description="ID of the target student")
    teacher_action: Optional[TeacherActionType] = Field(None, description="Explicit action type if available (e.g. from button click)")
    input_type: InputTypeType = Field("text", description="Type of input: text or voice")
    content: str = Field(..., description="The actual text content or command payload")

# --- State & Logic Models ---
class DecisionTrace(BaseModel):
    intent: str = Field(..., description="The detected intent from NLP")
    rule_applied: Optional[str] = Field(None, description="ID of the rule that triggered")
    state_before: Dict[str, Any] = Field(..., description="Student state before processing")
    state_after: Dict[str, Any] = Field(..., description="Student state after processing")

class StudentStateModel(BaseModel):
    student_id: str
    mood: EmotionType
    attention_level: float
    energy_level: float
    current_activity: str
    last_updated: datetime

# --- Response Models ---
class AIResponseMeta(BaseModel):
    timestamp: str
    source: InputSourceType

class AIResponse(BaseModel):
    animation: str = Field(..., description="Name of the animation to trigger in Unity")
    reply_text: str = Field(..., description="Text response from the student")
    emotion: EmotionType = Field(..., description="Emotion tag for facial expressions")
    confidence: float = Field(..., description="Confidence score of the decision (0.0-1.0)")
    student_state: StudentStateType = Field(..., description="High level state summary")
    decision_trace: DecisionTrace = Field(..., description="Detailed trace of AI decision logic")
    meta: AIResponseMeta = Field(..., description="Metadata including timestamp")

