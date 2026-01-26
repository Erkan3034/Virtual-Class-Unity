# Unity Integration Guide

This guide explains how to connect your Unity project to the AI Backend using the `BestHTTP` or standard `UnityWebRequest`.

## 1. Quick Setup

1. Create a C# script named `AIClient.cs`.
2. Attach it to your Student Character GameObject.
3. Assign the API URL (e.g., `http://localhost:8000/teacher-input`).

## 2. C# Implementation Example

```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Text;

[System.Serializable]
public class TeacherInput
{
    public string teacher_id;
    public string student_id;
    public string input_type;
    public string content;
}

[System.Serializable]
public class AIResponse
{
    public string animation;
    public string reply_text;
    public string emotion;
    public float confidence;
}

public class AIClient : MonoBehaviour
{
    private string apiUrl = "http://localhost:8000/teacher-input";
    
    // Call this method when Teacher sends input
    public void SendTeacherInput(string text)
    {
        StartCoroutine(PostRequest(text));
    }

    IEnumerator PostRequest(string text)
    {
        TeacherInput requestData = new TeacherInput
        {
            teacher_id = "teacher_1",
            student_id = "student_1",
            input_type = "text",
            content = text
        };

        string json = JsonUtility.ToJson(requestData);

        var request = new UnityWebRequest(apiUrl, "POST");
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError("Error: " + request.error);
        }
        else
        {
            Debug.Log("Response: " + request.downloadHandler.text);
            HandleResponse(request.downloadHandler.text);
        }
    }

    void HandleResponse(string json)
    {
        AIResponse response = JsonUtility.FromJson<AIResponse>(json);
        
        // 1. Play Animation
        GetComponent<Animator>().SetTrigger(response.animation);
        
        // 2. Show Text (e.g., in a Bubble)
        Debug.Log("Student says: " + response.reply_text);
        
        // 3. Handle Emotion (e.g. change face texture)
        Debug.Log("Emotion: " + response.emotion);
    }
}
```

## 3. Animation Triggers

Ensure your Animator Controller has these triggers:

- `happy_nod`
- `excited_raise_hand`
- `confused_scratch_head`
- `sleepy_yawn`
- `thinking_pose`
- `neutral_stand`
- `listening_pose`

## 4. Troubleshooting

- **Connection Refused:** Make sure the backend is running (`uvicorn main:app`).
- **422 Unprocessable Entity:** Check your JSON field names match exactly.
- **CORS Error:** Not applicable for Unity, but ensure backend allows all origins for testing.
