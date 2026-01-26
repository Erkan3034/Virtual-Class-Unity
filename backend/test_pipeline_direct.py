#!/usr/bin/env python3
"""
Direct test script to isolate the 500 error.
Run with: python test_pipeline_direct.py
"""
import sys
sys.path.insert(0, '.')

from models.definitions import TeacherInputRequest
from ai.pipeline import pipeline

def test():
    print("=== Testing Pipeline Directly ===")
    
    # Create a simple request
    request = TeacherInputRequest(
        source="web",
        teacher_id="test_teacher",
        student_id="student_001",
        teacher_action="praise",  # Use a known intent
        input_type="text",
        content="Aferin sana!"
    )
    
    try:
        print(f"Request: {request}")
        response = pipeline.process(request)
        print(f"SUCCESS! Response: {response}")
        print(f"reply_text: {response.reply_text}")
    except Exception as e:
        import traceback
        print(f"ERROR: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test()
