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
    personality_traits: Dict[str, str] = Field(default_factory=dict)
    short_term_memory: list[str] = Field(default_factory=list)
    long_term_memory: list[str] = Field(default_factory=list)
    last_interaction: Optional[datetime] = None
    current_activity: str
    last_updated: datetime

# --- Response Models ---
class AIResponseMeta(BaseModel):
    timestamp: str
    source: InputSourceType
    latency_ms: int = 0
    decision_id: str = ""

class AIResponse(BaseModel):
    """Internal full response model with trace for Debug Dashboard."""
    animation: str
    reply_text: str
    emotion: EmotionType
    confidence: float
    student_state: StudentStateType
    decision_trace: DecisionTrace
    meta: AIResponseMeta

class UnityResponse(BaseModel):
    """Strictly enforced contract for Unity Client."""
    animation: str
    reply_text: str
    emotion: EmotionType
    confidence: float
    student_state: StudentStateType
    meta: Dict[str, Any] # latency_ms and decision_id


