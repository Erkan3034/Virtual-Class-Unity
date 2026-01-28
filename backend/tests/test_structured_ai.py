import requests
import json
import time

def test_animations():
    url = "http://localhost:8000/api/v1/teacher/input"
    
    test_cases = [
        {"input": "Lütfen oturur musun?", "expected_animation": "sit", "desc": "Natural sit command"},
        {"input": "Ayağa kalkar mısın?", "expected_animation": "stand", "desc": "Natural stand command"},
        {"input": "Güneş sistemi hakkında bilgi ver", "expected_animation": "thinking_pose", "desc": "Knowledge query"}
    ]
    
    for case in test_cases:
        payload = {
            "source": "web",
            "teacher_id": "test_teacher",
            "student_id": 1,
            "input_type": "text",
            "content": case["input"]
        }
        
        print(f"\n--- Testing: {case['desc']} ---")
        print(f"Input: {case['input']}")
        
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            
            received_anim = data.get("animation")
            reply = data.get("reply_text")
            
            print(f"Reply: {reply}")
            print(f"Animation: {received_anim}")
            
            if received_anim == case["expected_animation"]:
                print(f"SUCCESS: Match!")
            else:
                print(f"WARNING: Expected {case['expected_animation']}, got {received_anim}")
                
        except Exception as e:
            print(f"Error: {e}")
        
        time.sleep(1)

if __name__ == "__main__":
    test_animations()
