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

export interface StudentStateModel {
  student_id: string;
  mood: EmotionType;
  attention_level: number;
  energy_level: number;
  personality_traits: Record<string, string>;
  short_term_memory: string[];
  long_term_memory: string[];
  last_interaction?: string;
  current_activity: string;
  last_updated: string;
}

export interface AIResponseMeta {
  timestamp: string;
  source: InputSourceType;
  latency_ms: number;
  decision_id: string;
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

export interface UnityResponse {
  animation: string;
  reply_text: string;
  emotion: EmotionType;
  confidence: number;
  student_state: StudentStateType;
  meta: {
    latency_ms: number;
    decision_id: string;
  };
}


// --- UI Helpers ---
export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
}

