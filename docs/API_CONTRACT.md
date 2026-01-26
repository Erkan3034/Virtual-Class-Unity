# Virtual Classroom AI System - API Contract

## Base URL
`http://localhost:8000` (Local)
`http://<SERVER_IP>:8000` (Production)

## Endpoints

### 1. Teacher Input
**URL:** `/teacher-input`
**Method:** `POST`
**Content-Type:** `application/json`

#### Request Payload
| Field | Type | Required | Description |
|---|---|---|---|
| `teacher_id` | string | Yes | ID of the teacher (e.g., "teacher_01") |
| `student_id` | string | Yes | ID of the target student (e.g., "student_01") |
| `input_type` | string | No | "text" or "voice". Default: "text" |
| `content` | string | Yes | The command or question text |

**Example Request:**
```json
{
  "teacher_id": "T001",
  "student_id": "S101",
  "input_type": "text",
  "content": "Aferin, çok güzel cevap verdin."
}
```

#### Response Payload
| Field | Type | Description |
|---|---|---|
| `animation` | string | Animation trigger name for Unity |
| `reply_text` | string | Text reply from the student |
| `emotion` | string | Emotion tag (happy, sad, neutral, etc.) |
| `confidence` | float | AI confidence score (0.0 - 1.0) |
| `meta` | object | Metadata for debugging and state info |

**Example Response:**
```json
{
  "animation": "happy_nod",
  "reply_text": "Teşekkür ederim öğretmenim!",
  "emotion": "happy",
  "confidence": 0.95,
  "meta": {
    "student_state": "motivated",
    "intent_detected": "praise",
    "timestamp": "2026-01-26T14:55:00"
  }
}
```

## Animation List (MVP)

These strings are returned in the `animation` field. Unity should map these to Animator triggers.

- `neutral_stand` - Idle state
- `listening_pose` - Active listening
- `happy_nod` - Positive confirmation / Agreement
- `happy_wave` - Greeting
- `excited_raise_hand` - Asking permission / Enthusiasm
- `confused_scratch_head` - Confusion / Check understanding
- `confused_look` - Slight confusion
- `sleepy_yawn` - Low energy / Boredom
- `thinking_pose` - Processing / Thinking

## Error Handling

Standard HTTP status codes are used.

- `200 OK`: Success
- `422 Validation Error`: Invalid JSON body
- `500 Server Error`: AI processing failure

**Error Response Example:**
```json
{
  "detail": "Field 'content' is required"
}
```
