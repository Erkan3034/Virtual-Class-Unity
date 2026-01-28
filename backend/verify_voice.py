import requests
import base64
import json
import os

# Configuration
API_URL = "http://localhost:8000/api/v1/teacher/input"
# Note: You can provide a real .wav file path here to test with actual audio
TEST_AUDIO_PATH = "sample_audio.wav" 

def test_voice_input():
    # If no real audio file, we'll just log that we need one or use a dummy string
    # In a real scenario, we'd read a .wav file
    if not os.path.exists(TEST_AUDIO_PATH):
        print(f"ERROR: {TEST_AUDIO_PATH} not found. Please provide a small .wav file to test.")
        # Simulating a base64 string that represents audio (Whisper might fail on this if it's not valid audio)
        # For a pure integration test, we just want to see if the flow triggers.
        dummy_audio_b64 = "UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=" 
        payload = {
            "source": "web",
            "teacher_id": "test_admin",
            "student_id": "student_001",
            "input_type": "voice",
            "content": dummy_audio_b64
        }
    else:
        with open(TEST_AUDIO_PATH, "rb") as f:
            audio_b64 = base64.b64encode(f.read()).decode('utf-8')
        
        payload = {
            "source": "web",
            "teacher_id": "test_admin",
            "student_id": "student_001",
            "input_type": "voice",
            "content": audio_b64
        }

    print(f"Sending request to {API_URL}...")
    try:
        response = requests.post(API_URL, json=payload)
        print(f"Status Code: {response.status_code}")
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_voice_input()
