# Virtual Classroom AI System (MVP)

An MVP backend/frontend system for a Unity-based virtual classroom, featuring AI-driven student-teacher interaction.

## Architecture

- **Backend:** Python FastAPI (Modular, Extensible)
- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Unity:** C# Client (HTTP REST)

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm

## Setup & Running

### 1. Backend

```bash
cd backend
# Create virtual env (optional but recommended)
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload
```

Server will run at `http://localhost:8000`.
Docs available at `http://localhost:8000/docs`.

### 2. Frontend (Teacher Panel)

```bash
cd frontend
npm install
npm run dev
```

UI will be available at `http://localhost:5173`.

## Features (MVP)

- **Teacher Input:** Send text commands/questions to students.
- **NLP Analysis:** Rule-based intent detection (Greeting, Praise, Discipline, etc.).
- **Student Agent:** Maintains basic state (Mood, Attention).
- **Decision Engine:** Selects appropriate response and animation.
- **Unity Integration:** JSON-based API for character control.

## Project Structure

- `backend/app/nlp`: NLP logic and Knowledge Base.
- `backend/app/ai`: Student Agent and Decision Engine.
- `docs/API_CONTRACT.md`: Full API specification.
- `docs/UNITY_INTEGRATION.md`: Unity C# script example.

## Future Roadmap

- [ ] Voice Input (STT) & Speech Output (TTS)
- [ ] LLM Integration (OpenAI/Anthropic)
- [ ] Vector Database (RAG)
- [ ] Multi-Agent Orchestration
