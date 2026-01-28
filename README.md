# Virtual Classroom AI System (MVP)

An MVP backend/frontend system for a Unity-based virtual classroom, featuring AI-driven student-teacher interaction. This system uses a modular Python backend (FastAPI) and a React-based teacher dashboard to simulate and control virtual student agents.

## 🏗 System Architecture

For a detailed view of the system flow, data flow, and components, please refer to the [System Architecture Diagram](docs/FLOW_DIAGRAM.md).

- **Backend:** Python FastAPI (Modular, Extensible, Sync/Async Support)
- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **AI Engine:** Google Gemini & Groq (Llama 3) for Decision Making
- **Unity:** C# Client (WebSocket & REST Integration)

## 🚀 Active Features

### 1. AI-Driven Decision Pipeline
The core of the system is the `ai/pipeline.py` which processes inputs through stages:
- **NLP Analyzer:** Rule-based detection for common intents (Greeting, Praise, Discipline).
- **Knowledge Base:** Pre-defined responses for instant feedback.
- **LLM Integration:** Handling complex or unknown queries using Groq/Gemini.

### 2. Multi-Client Synchronization
- **WebSocket Manager:** Broadcasts state changes to all connected clients (Unity & Web).
- **Role-Based Messaging:** Directed messages to specific roles (`unity`, `debug`, `teacher`).

### 3. Teacher Dashboard & Debug Tools
- **Teacher Panel:** Interface for sending manual commands and overriding AI behavior.
- **Debug Dashboard:** Real-time visibility into the "thought process" of the AI (latency, confidence, decided emotion).

## 🛠 Setup & Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Configuration:** Create a `.env` file in the `backend` folder with your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_key
   GROQ_API_KEY=your_groq_key
   DEBUG=True
   SECRET_KEY=your_secret_key
   ```
   *(Note: See `.env.example` if available or ask for keys if working in a team)*

5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   - API Docs: `http://localhost:8000/docs`
   - WebSocket: `ws://localhost:8000/ws/v1/classroom/{room_id}`

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   - Application: `http://localhost:5173`

## 📖 How to Use

1. **Start Services:** Ensure both Backend (Port 8000) and Frontend (Port 5173) are running.
2. **Open Teacher Panel:** Go to `http://localhost:5173` in your browser.
3. **Connect Unity (Optional):** If developing with Unity, run the client to automatically connect to `ws://localhost:8000`.
4. **Send Commands:**
   - Use the Dashboard to send commands like "Sit Down", "Answer Question".
   - The AI will process the intent, select an animation/emotion, and broadcast it.
   - You will see the response in the Debug section of the dashboard.

## 📂 Project Structure

- `backend/app`: Core application logic (Pipeline, Models).
- `backend/ai`: Decision engines and integrations (Groq, Gemini).
- `backend/nlp`: Natural Language Processing and Knowledge Base.
- `backend/ws`: WebSocket connection manager.
- `docs/`: Detailed design documents and API specs.
