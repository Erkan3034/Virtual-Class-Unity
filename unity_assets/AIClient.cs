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
    [Header("Configuration")]
    [Tooltip("The URL of your Python Backend")]
    public string apiUrl = "http://localhost:8000/teacher-input";
    
    [Tooltip("ID of this student character")]
    public string studentId = "student_001";

    [Header("Debug")]
    public bool showDebugLogs = true;

    // Call this method when Teacher sends input
    public void SendTeacherInput(string text)
    {
        StartCoroutine(PostRequest(text));
    }

    IEnumerator PostRequest(string text)
    {
        TeacherInput requestData = new TeacherInput
        {
            teacher_id = "teacher_curr", // Could be dynamic
            student_id = studentId,
            input_type = "text",
            content = text
        };

        string json = JsonUtility.ToJson(requestData);

        if (showDebugLogs) Debug.Log($"Sending to {apiUrl}: {json}");

        var request = new UnityWebRequest(apiUrl, "POST");
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError("AI Backend Error: " + request.error);
        }
        else
        {
            if (showDebugLogs) Debug.Log("Response: " + request.downloadHandler.text);
            HandleResponse(request.downloadHandler.text);
        }
    }

    void HandleResponse(string json)
    {
        try 
        {
            AIResponse response = JsonUtility.FromJson<AIResponse>(json);
            
            // 1. Play Animation
            var animator = GetComponent<Animator>();
            if (animator != null && !string.IsNullOrEmpty(response.animation)) 
            {
                animator.SetTrigger(response.animation);
            }
            
            // 2. Show Text (Implement your Bubble UI here)
            Debug.Log($"<color=green>{studentId} says:</color> {response.reply_text}");
            
            // 3. Handle Emotion
            // Example: GetComponent<FaceController>().SetEmotion(response.emotion);
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to parse response: {e.Message}");
        }
    }
}
