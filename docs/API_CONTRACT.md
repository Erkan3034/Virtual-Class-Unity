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

### System Messages (Internal Commands)
Used for auth and lifecycle synchronization.

```json
{
  "type": "CLIENT_INIT",
  "client_id": "uuid",
  "role": "unity | teacher | debug",
  "token": "jwt_token"
}
```

```json
{
  "type": "STATE_SNAPSHOT",
  "room_id": "uuid",
  "students": [
     { "student_id": "uuid", "state": "attentive", "animation": "idle" }
  ]
}
```

## REST API (v1)

### Security
- `POST /api/v1/auth/login` - Returns JWT with roles.
- `GET /api/v1/auth/verify` - Validates token.

### Student Management
- `GET /api/v1/students/` - List all students.
- `GET /api/v1/students/{id}/history` - Interaction history.
- `POST /api/v1/students/{id}/state` - Manual state update (Teacher action).

### Lesson Management
- `GET /api/v1/lessons/` - List scenarios.
- `POST /api/v1/lessons/start` - Initialize classroom session.
