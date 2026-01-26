import sys
import os

# Add the directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai.pipeline import pipeline
from models.definitions import TeacherInputRequest, UnityResponse

def test_pipeline_output():
    print("Testing AI Pipeline...")
    req = TeacherInputRequest(
        source="unity",
        teacher_id="test_teacher",
        student_id="test_student_1",
        content="Gunes can you pay attention please?",
        teacher_action="warn"
    )
    
    response = pipeline.process(req)
    
    print(f"Full Response Latency: {response.meta.latency_ms}ms")
    print(f"Decision ID: {response.meta.decision_id}")
    
    # Verify Unity Contract
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
    
    print("Unity Contract Verified!")
    print(f"Payload: {unity_payload.model_dump_json(indent=2)}")

if __name__ == "__main__":
    test_pipeline_output()
