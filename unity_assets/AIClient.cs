using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;

// --- Data Models (Must match Backend JSON) ---

[System.Serializable]
public class TeacherInputRequest
{
    public string source = "unity";
    public string teacher_id;
    public string student_id;
    public string teacher_action; // Optional: "praise", "warn", etc.
    public string input_type = "text";
    public string content;
}

[System.Serializable]
public class DecisionTrace
{
    public string intent;
    public string rule_applied;
    // Note: Complex nested JSON objects (state_before/after) might need 
    // a separate class or custom parser in Unity if you want to inspect them deeply.
    // For now we keep them as common strings or simplified if needed.
    // JsonUtility has limits with Dictionaries/nested objects without specific wrappers.
}

[System.Serializable]
public class AIResponseMeta
{
    public string timestamp;
    public string source;
}

[System.Serializable]
public class AIResponse
{
    public string animation;
    public string reply_text;
    public string emotion;
    public float confidence;
    public string student_state;
    public DecisionTrace decision_trace;
    public AIResponseMeta meta;
}

public class AIClient : MonoBehaviour
{
    [Header("Configuration")]
    [Tooltip("The URL of your Python Backend")]
    public string apiUrl = "http://localhost:8000/teacher-input";
    
    [Tooltip("ID of this student character")]
    public string studentId = "student_001";
    
    [Tooltip("ID of the teacher")]
    public string teacherId = "teacher_unity_user";

    [Header("Debug")]
    public bool showDebugLogs = true;

    // --- Public Methods to Call from Unity UI / Scripts ---
    
    public void SendPraise(string message = "Aferin!")
    {
        StartCoroutine(PostRequest("praise", message));
    }

    public void SendWarning(string message = "Sessiz ol!")
    {
        StartCoroutine(PostRequest("warn", message));
    }

    public void SendCustomText(string text)
    {
        StartCoroutine(PostRequest(null, text));
    }

    // --- Core Networking ---

    IEnumerator PostRequest(string actionType, string content)
    {
        TeacherInputRequest requestData = new TeacherInputRequest
        {
            source = "unity",
            teacher_id = teacherId,
            student_id = studentId,
            teacher_action = actionType,
            input_type = "text",
            content = content
        };

        string json = JsonUtility.ToJson(requestData);

        if (showDebugLogs) Debug.Log($"[AIClient] Sending: {json}");

        var request = new UnityWebRequest(apiUrl, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError($"[AIClient] Error: {request.error}\nResponse: {request.downloadHandler.text}");
        }
        else
        {
            string responseText = request.downloadHandler.text;
            if (showDebugLogs) Debug.Log($"[AIClient] Response: {responseText}");
            HandleResponse(responseText);
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
            
            // 2. Log Decision Trace (For Editor Debugging)
            if (showDebugLogs && response.decision_trace != null)
            {
                Debug.Log($"<color=cyan>Intent Detected:</color> {response.decision_trace.intent}");
                Debug.Log($"<color=orange>Student State:</color> {response.student_state}");
            }

            // 3. UI / Speech Bubble Hook
            // FindObjectsOfType<BubbleManager>().Show(response.reply_text);
            Debug.Log($"<color=green>{studentId} says:</color> {response.reply_text}");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"[AIClient] JSON Parse Error: {e.Message}");
        }
    }
}
