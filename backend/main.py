from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models import TeacherInputRequest, AIResponse
from app.ai.decision_engine import decision_engine
from app.api.response_builder import response_builder

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
    """Health check endpoint."""
    return {"status": "ok", "message": "Virtual Classroom AI Backend is running"}

@app.post("/teacher-input", response_model=AIResponse)
async def process_teacher_input(request: TeacherInputRequest):
    """
    Main endpoint for receiving teacher commands.
    Used by both Unity and Web Frontend.
    """
    try:
        # Core Logic Execution
        decision, meta = decision_engine.process_input(
            teacher_id=request.teacher_id,
            student_id=request.student_id,
            text=request.content
        )
        
        # Build Response
        response = response_builder.build_response(decision, meta)
        
        return response
        
    except Exception as e:
        # In production, log this error properly
        print(f"Error processing input: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
