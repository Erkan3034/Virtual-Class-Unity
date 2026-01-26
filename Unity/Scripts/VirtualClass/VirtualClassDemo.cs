/*
 * VirtualClassDemo.cs
 * Virtual Classroom - Unity Integration
 * 
 * Demo scene setup script - creates a basic test environment.
 * Attach to an empty GameObject in your scene.
 * 
 * Place this file in: Assets/Scripts/VirtualClass/
 */

using UnityEngine;

namespace VirtualClass
{
    /// <summary>
    /// Demo script for testing Virtual Classroom integration
    /// </summary>
    public class VirtualClassDemo : MonoBehaviour
    {
        [Header("Configuration")]
        public string serverHost = "localhost";
        public int serverPort = 8000;
        public string roomId = "room_001";

        [Header("Test Settings")]
        public string testStudentId = "student_001";
        public KeyCode praiseKey = KeyCode.Alpha1;
        public KeyCode warnKey = KeyCode.Alpha2;
        public KeyCode encourageKey = KeyCode.Alpha3;
        public KeyCode questionKey = KeyCode.Alpha4;
        public KeyCode sitKey = KeyCode.Alpha5;
        public KeyCode standKey = KeyCode.Alpha6;

        private void Start()
        {
            // Configure client
            var client = VirtualClassClient.Instance;
            client.serverHost = serverHost;
            client.serverPort = serverPort;
            client.roomId = roomId;

            // Subscribe to events
            VirtualClassEvents.OnConnected += () => Debug.Log("✅ Connected to Virtual Classroom!");
            VirtualClassEvents.OnDisconnected += () => Debug.Log("❌ Disconnected from Virtual Classroom");
            VirtualClassEvents.OnAIResponse += OnResponse;

            // Connect
            _ = client.Connect();

            Debug.Log("=== Virtual Classroom Demo ===");
            Debug.Log("Press 1-6 to send teacher commands:");
            Debug.Log("1 = Praise, 2 = Warn, 3 = Encourage");
            Debug.Log("4 = Question, 5 = Sit, 6 = Stand");
        }

        private void Update()
        {
            if (Input.GetKeyDown(praiseKey))
                SendCommand(TeacherActionType.praise);
            
            if (Input.GetKeyDown(warnKey))
                SendCommand(TeacherActionType.warn);
            
            if (Input.GetKeyDown(encourageKey))
                SendCommand(TeacherActionType.encourage);
            
            if (Input.GetKeyDown(questionKey))
                SendCommand(TeacherActionType.question);
            
            if (Input.GetKeyDown(sitKey))
                SendCommand(TeacherActionType.command_sit);
            
            if (Input.GetKeyDown(standKey))
                SendCommand(TeacherActionType.command_stand);
        }

        private void SendCommand(TeacherActionType action)
        {
            Debug.Log($"Sending {action} to {testStudentId}...");
            _ = VirtualClassClient.Instance.SendTeacherCommand(testStudentId, action);
        }

        private void OnResponse(AIResponse response)
        {
            Debug.Log($"=== AI Response ===");
            Debug.Log($"Reply: {response.reply_text}");
            Debug.Log($"Animation: {response.animation}");
            Debug.Log($"Emotion: {response.emotion}");
            Debug.Log($"Confidence: {response.confidence:P0}");
        }

        private void OnGUI()
        {
            GUILayout.BeginArea(new Rect(10, 10, 300, 200));
            
            GUILayout.Label("Virtual Classroom Demo", GUI.skin.box);
            GUILayout.Label($"Connection: {(VirtualClassClient.Instance.IsConnected ? "✅ Connected" : "❌ Disconnected")}");
            GUILayout.Label($"Server: {serverHost}:{serverPort}");
            GUILayout.Label($"Room: {roomId}");
            GUILayout.Space(10);
            GUILayout.Label("Press 1-6 to test commands");

            GUILayout.EndArea();
        }
    }
}
