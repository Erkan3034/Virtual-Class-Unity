from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from models.definitions import TeacherInputRequest, AIResponse, UnityResponse
from ai.pipeline import pipeline
from ws.manager import manager
from security.auth import get_current_user, check_role

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.API_VERSION,
    description="Backend for Virtual Classroom AI System"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok", "message": "Virtual Classroom AI Backend is running."}

@app.post("/api/v1/teacher/input", response_model=AIResponse)
async def process_teacher_input(
    request: TeacherInputRequest, 
    user: dict = Depends(check_role(["teacher", "admin"]))
):
    """REST endpoint for manual teacher overrides."""
    try:
        response = pipeline.process(request)
        # Broadcast the change to Unity and Debug Dashboard
        # In a real room setup, room_id would be in the request
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/v1/classroom/{room_id}")
async def classroom_socket(
    websocket: WebSocket, 
    room_id: str, 
    token: str = Query(...)
):
    """Main real-time gateway for Unity and Web clients."""
    user = await manager.connect(websocket, room_id, token)
    if not user:
        return

    try:
        # Send initial snapshot if Unity
        if user["role"] == "unity":
            await websocket.send_json({"type": "INIT_SUCCESS", "message": "Unity connected"})

        while True:
            data = await websocket.receive_json()
            
            # 1. Handle incoming Unity/Teacher messages
            if data.get("type") == "STUDENT_INPUT":
                # Process through AI Pipeline
                req = TeacherInputRequest(
                    source="unity",
                    teacher_id="system",
                    student_id=data["student_id"],
                    content=data["text"]
                )
                response = pipeline.process(req)
                
                # 2. Strict Contract Enforcement for Unity
                unity_payload = UnityResponse(
                    animation=response.animation,
                    reply_text=response.reply_text,
                    emotion=response.emotion,
                    confidence=response.confidence,
                    student_state=response.student_state,
                    meta={
                        "latency_ms": response.meta.latency_ms,
                        "decision_id": response.meta.decision_id
                    }
                )
                
                # 3. Emit
                # To Unity Client
                await manager.send_to_role(room_id, "unity", unity_payload.model_dump())
                # To Debug Dashboard (Full response with trace)
                await manager.send_to_role(room_id, "debug", response.model_dump())

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WS Error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
