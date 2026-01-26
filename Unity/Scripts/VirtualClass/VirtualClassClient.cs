/*
 * VirtualClassClient.cs
 * Virtual Classroom - Unity Integration
 * 
 * Main WebSocket client for connecting to the Virtual Classroom backend.
 * Place this file in: Assets/Scripts/VirtualClass/
 * 
 * DEPENDENCY: NativeWebSocket
 * Install via Package Manager: https://github.com/endel/NativeWebSocket
 * Or add to manifest.json:
 * "com.endel.nativewebsocket": "https://github.com/endel/NativeWebSocket.git#upm"
 */

using System;
using System.Collections;
using System.Threading.Tasks;
using UnityEngine;
using NativeWebSocket;

namespace VirtualClass
{
    /// <summary>
    /// Main client for connecting to Virtual Classroom backend
    /// </summary>
    public class VirtualClassClient : MonoBehaviour
    {
        #region Singleton

        private static VirtualClassClient _instance;
        public static VirtualClassClient Instance
        {
            get
            {
                if (_instance == null)
                {
                    var go = new GameObject("VirtualClassClient");
                    _instance = go.AddComponent<VirtualClassClient>();
                    DontDestroyOnLoad(go);
                }
                return _instance;
            }
        }

        #endregion

        #region Configuration

        [Header("Server Configuration")]
        [Tooltip("Backend server URL (without protocol)")]
        public string serverHost = "localhost";

        [Tooltip("Backend server port")]
        public int serverPort = 8000;

        [Tooltip("Classroom/Room ID")]
        public string roomId = "room_001";

        [Tooltip("Authentication token (use dev-unity-token for development)")]
        public string authToken = "dev-unity-token";

        [Header("Connection Settings")]
        [Tooltip("Auto-reconnect on disconnect")]
        public bool autoReconnect = true;

        [Tooltip("Reconnect delay in seconds")]
        public float reconnectDelay = 3f;

        [Tooltip("Maximum reconnect attempts (0 = infinite)")]
        public int maxReconnectAttempts = 10;

        #endregion

        #region State

        private WebSocket _ws;
        private bool _isConnecting = false;
        private int _reconnectAttempts = 0;

        public bool IsConnected => _ws != null && _ws.State == WebSocketState.Open;
        public WebSocketState ConnectionState => _ws?.State ?? WebSocketState.Closed;

        #endregion

        #region Unity Lifecycle

        private void Awake()
        {
            if (_instance == null)
            {
                _instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else if (_instance != this)
            {
                Destroy(gameObject);
            }
        }

        private void Update()
        {
            // Required for NativeWebSocket to dispatch messages
            #if !UNITY_WEBGL || UNITY_EDITOR
            _ws?.DispatchMessageQueue();
            #endif
        }

        private void OnDestroy()
        {
            Disconnect();
        }

        private void OnApplicationQuit()
        {
            Disconnect();
        }

        #endregion

        #region Connection

        /// <summary>
        /// Connect to the Virtual Classroom server
        /// </summary>
        public async Task Connect()
        {
            if (_isConnecting || IsConnected) return;

            _isConnecting = true;
            string url = $"ws://{serverHost}:{serverPort}/ws/v1/classroom/{roomId}?token={authToken}";

            Debug.Log($"[VirtualClass] Connecting to: {url}");

            try
            {
                _ws = new WebSocket(url);

                _ws.OnOpen += OnWebSocketOpen;
                _ws.OnClose += OnWebSocketClose;
                _ws.OnError += OnWebSocketError;
                _ws.OnMessage += OnWebSocketMessage;

                await _ws.Connect();
            }
            catch (Exception e)
            {
                Debug.LogError($"[VirtualClass] Connection failed: {e.Message}");
                VirtualClassEvents.TriggerConnectionError(e.Message);
                _isConnecting = false;

                if (autoReconnect)
                {
                    StartCoroutine(TryReconnect());
                }
            }
        }

        /// <summary>
        /// Disconnect from the server
        /// </summary>
        public async void Disconnect()
        {
            autoReconnect = false;
            if (_ws != null)
            {
                await _ws.Close();
                _ws = null;
            }
        }

        private IEnumerator TryReconnect()
        {
            while (autoReconnect && !IsConnected)
            {
                if (maxReconnectAttempts > 0 && _reconnectAttempts >= maxReconnectAttempts)
                {
                    Debug.LogError("[VirtualClass] Max reconnect attempts reached");
                    yield break;
                }

                _reconnectAttempts++;
                Debug.Log($"[VirtualClass] Reconnecting... Attempt {_reconnectAttempts}");

                yield return new WaitForSeconds(reconnectDelay);

                _ = Connect();

                yield return new WaitForSeconds(1f); // Wait for connection attempt
            }
        }

        #endregion

        #region WebSocket Handlers

        private void OnWebSocketOpen()
        {
            Debug.Log("[VirtualClass] Connected to server!");
            _isConnecting = false;
            _reconnectAttempts = 0;
            VirtualClassEvents.TriggerConnected();
        }

        private void OnWebSocketClose(WebSocketCloseCode code)
        {
            Debug.Log($"[VirtualClass] Disconnected: {code}");
            _isConnecting = false;
            VirtualClassEvents.TriggerDisconnected();

            if (autoReconnect && code != WebSocketCloseCode.Normal)
            {
                StartCoroutine(TryReconnect());
            }
        }

        private void OnWebSocketError(string error)
        {
            Debug.LogError($"[VirtualClass] WebSocket Error: {error}");
            VirtualClassEvents.TriggerConnectionError(error);
        }

        private void OnWebSocketMessage(byte[] bytes)
        {
            string json = System.Text.Encoding.UTF8.GetString(bytes);
            Debug.Log($"[VirtualClass] Received: {json}");

            try
            {
                // Parse as AIResponse
                AIResponse response = JsonUtility.FromJson<AIResponse>(json);
                
                if (response != null && !string.IsNullOrEmpty(response.reply_text))
                {
                    VirtualClassEvents.TriggerAIResponse(response);
                }
            }
            catch (Exception e)
            {
                Debug.LogWarning($"[VirtualClass] Failed to parse message: {e.Message}");
            }
        }

        #endregion

        #region Send Messages

        /// <summary>
        /// Send a student action to the server
        /// </summary>
        public async Task SendStudentAction(string studentId, string actionType, string content = "")
        {
            if (!IsConnected)
            {
                Debug.LogWarning("[VirtualClass] Cannot send: not connected");
                return;
            }

            var payload = new StudentActionPayload(studentId, actionType, content);
            string json = JsonUtility.ToJson(payload);

            Debug.Log($"[VirtualClass] Sending: {json}");
            await _ws.SendText(json);
        }

        /// <summary>
        /// Send a teacher command to the server
        /// </summary>
        public async Task SendTeacherCommand(string studentId, TeacherActionType action, string content = "")
        {
            if (!IsConnected)
            {
                Debug.LogWarning("[VirtualClass] Cannot send: not connected");
                return;
            }

            var payload = new
            {
                type = "teacher_input",
                data = new
                {
                    source = "unity",
                    teacher_id = "unity_teacher",
                    student_id = studentId,
                    teacher_action = action.ToString(),
                    input_type = "text",
                    content = string.IsNullOrEmpty(content) ? $"Teacher triggered {action}" : content
                }
            };

            string json = JsonUtility.ToJson(payload);
            Debug.Log($"[VirtualClass] Sending teacher command: {json}");
            await _ws.SendText(json);

            VirtualClassEvents.TriggerTeacherCommand(studentId, action);
        }

        /// <summary>
        /// Send raw JSON to the server (for custom messages)
        /// </summary>
        public async Task SendRaw(string json)
        {
            if (!IsConnected)
            {
                Debug.LogWarning("[VirtualClass] Cannot send: not connected");
                return;
            }

            await _ws.SendText(json);
        }

        #endregion
    }
}
