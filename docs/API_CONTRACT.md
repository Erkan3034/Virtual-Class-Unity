# API Contract Documentation

## WebSocket Protocol

### Unity Client Payload (Strict)
Unity receives exactly this shape for every student response.

```json
{
  "animation": "string_enum",
  "reply_text": "string",
  "emotion": "string_enum",
  "confidence": 0.0,
  "student_state": "string_enum",
  "meta": {
    "latency_ms": 0,
    "decision_id": "uuid"
  }
}
```

#### Enums
- **Animation**: `IDLE`, `TALKING`, `LISTENING`, `THINKING`, `HAPPY`, `SAD`, `ANGRY`, `SLEEPY`.
- **Emotion**: `NEUTRAL`, `JOY`, `SADNESS`, `ANGER`, `SURPRISE`, `FEAR`, `DISGUST`.
- **Student State**: `ACTIVE`, `DISTRACTED`, `SLEEPING`, `TIRED`, `ENGAGED`.

### Teacher Web Panel Commands
Teachers can send commands to override AI or trigger specific events.

```json
{
  "type": "OVERRIDE_ACTION",
  "student_id": "uuid",
  "action": "praise",
  "payload": {}
}
```

## REST API (v1)

### Student Management
- `GET /api/v1/students/` - List all students.
- `GET /api/v1/students/{id}/history` - Interaction history.
- `POST /api/v1/students/{id}/state` - Manual state update (Teacher action).

### Lesson Management
- `GET /api/v1/lessons/` - List scenarios.
- `POST /api/v1/lessons/start` - Initialize classroom session.
