// --- Enums & Literals ---
export type TeacherActionType = "warn" | "praise" | "command_sit" | "command_stand" | "ignore" | "encourage" | "question";
export type InputSourceType = "unity" | "web";
export type InputTypeType = "text" | "voice";
export type EmotionType = "neutral" | "happy" | "sad" | "confused" | "sleepy" | "alert" | "motivated" | "regretful";
export type StudentStateType = "attentive" | "sleepy" | "confused" | "successful" | "idle" | "disruptive";

// --- Request ---
export interface TeacherInputRequest {
  source: InputSourceType;
  teacher_id: string;
  student_id: string;
  teacher_action?: TeacherActionType;
  input_type: InputTypeType;
  content: string;
}

// --- State & Trace ---
export interface DecisionTrace {
  intent: string;
  rule_applied: string | null;
  state_before: Record<string, any>;
  state_after: Record<string, any>;
}

export interface AIResponseMeta {
  timestamp: string;
  source: InputSourceType;
}

// --- Response ---
export interface AIResponse {
  animation: string;
  reply_text: string;
  emotion: EmotionType;
  confidence: number;
  student_state: StudentStateType;
  decision_trace: DecisionTrace;
  meta: AIResponseMeta;
}

// --- UI Helpers ---
export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
}

