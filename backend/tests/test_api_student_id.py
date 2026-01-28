import requests
import json

def test_student_id_in_response():
    url = "http://localhost:8000/api/v1/teacher/input"
    payload = {
        "source": "web",
        "teacher_id": "test_teacher_1",
        "student_id": 1,
        "input_type": "text",
        "content": "Ayağa kalk"
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        
        print("Response received:")
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        if "student_id" in data:
            print(f"SUCCESS: student_id '{data['student_id']}' found in response.")
        else:
            print("FAILURE: student_id NOT found in response.")
            
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    test_student_id_in_response()
