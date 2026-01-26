export interface TeacherInputRequest {
  teacher_id: string;
  student_id: string;
  input_type: 'text' | 'voice';
  content: string;
}

export interface AIResponseMeta {
  student_state: string;
  intent_detected: string;
  timestamp: string;
}

export interface AIResponse {
  animation: string;
  reply_text: string;
  emotion: string;
  confidence: number;
  meta: AIResponseMeta;
}

export interface Student {
  id: string;
  name: string;
  avatarUrl: string; // Placeholder for UI
}
