/*
 * TeacherController.cs
 * Virtual Classroom - Unity Integration
 * 
 * Controller for teacher interactions - send commands to students.
 * Attach to a UI manager or teacher avatar.
 * 
 * Place this file in: Assets/Scripts/VirtualClass/
 */

using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace VirtualClass
{
    /// <summary>
    /// Controller for teacher commands in Unity
    /// </summary>
    public class TeacherController : MonoBehaviour
    {
        #region Configuration

        [Header("Teacher Identity")]
        public string teacherId = "teacher_001";

        [Header("UI References (Optional)")]
        [Tooltip("Dropdown to select target student")]
        public TMP_Dropdown studentSelector;

        [Tooltip("Input field for custom messages")]
        public TMP_InputField messageInput;

        [Tooltip("Text to display last response")]
        public TMP_Text responseDisplay;

        [Tooltip("Connection status indicator")]
        public Image connectionIndicator;

        [Header("Target Student")]
        [Tooltip("Default target student ID")]
        public string targetStudentId = "student_001";

        #endregion

        #region Unity Lifecycle

        private void Start()
        {
            VirtualClassEvents.OnAIResponse += OnResponseReceived;
            VirtualClassEvents.OnConnected += OnConnected;
            VirtualClassEvents.OnDisconnected += OnDisconnected;

            UpdateConnectionIndicator(false);
        }

        private void OnDestroy()
        {
            VirtualClassEvents.OnAIResponse -= OnResponseReceived;
            VirtualClassEvents.OnConnected -= OnConnected;
            VirtualClassEvents.OnDisconnected -= OnDisconnected;
        }

        #endregion

        #region Event Handlers

        private void OnConnected()
        {
            UpdateConnectionIndicator(true);
            Debug.Log("[Teacher] Connected to server");
        }

        private void OnDisconnected()
        {
            UpdateConnectionIndicator(false);
            Debug.Log("[Teacher] Disconnected from server");
        }

        private void OnResponseReceived(AIResponse response)
        {
            if (responseDisplay != null)
            {
                responseDisplay.text = $"Yanıt: {response.reply_text}\n" +
                                       $"Animasyon: {response.animation}\n" +
                                       $"Duygu: {response.emotion}";
            }
        }

        private void UpdateConnectionIndicator(bool connected)
        {
            if (connectionIndicator != null)
            {
                connectionIndicator.color = connected ? Color.green : Color.red;
            }
        }

        #endregion

        #region Teacher Actions

        /// <summary>
        /// Send praise to target student
        /// </summary>
        public void SendPraise()
        {
            SendCommand(TeacherActionType.praise);
        }

        /// <summary>
        /// Send warning to target student
        /// </summary>
        public void SendWarn()
        {
            SendCommand(TeacherActionType.warn);
        }

        /// <summary>
        /// Send encouragement to target student
        /// </summary>
        public void SendEncourage()
        {
            SendCommand(TeacherActionType.encourage);
        }

        /// <summary>
        /// Ask a question to target student
        /// </summary>
        public void SendQuestion()
        {
            string message = messageInput != null ? messageInput.text : "";
            SendCommand(TeacherActionType.question, message);
        }

        /// <summary>
        /// Command student to sit
        /// </summary>
        public void SendSitCommand()
        {
            SendCommand(TeacherActionType.command_sit);
        }

        /// <summary>
        /// Command student to stand
        /// </summary>
        public void SendStandCommand()
        {
            SendCommand(TeacherActionType.command_stand);
        }

        /// <summary>
        /// Send custom message to student
        /// </summary>
        public void SendCustomMessage()
        {
            if (messageInput != null && !string.IsNullOrEmpty(messageInput.text))
            {
                SendCommand(TeacherActionType.question, messageInput.text);
                messageInput.text = "";
            }
        }

        /// <summary>
        /// Generic command sender
        /// </summary>
        public void SendCommand(TeacherActionType action, string content = "")
        {
            string studentId = GetTargetStudentId();
            _ = VirtualClassClient.Instance.SendTeacherCommand(studentId, action, content);
            Debug.Log($"[Teacher] Sent {action} to {studentId}");
        }

        private string GetTargetStudentId()
        {
            if (studentSelector != null && studentSelector.options.Count > 0)
            {
                return studentSelector.options[studentSelector.value].text;
            }
            return targetStudentId;
        }

        #endregion

        #region UI Helpers

        /// <summary>
        /// Set target student from UI (for button/dropdown events)
        /// </summary>
        public void SetTargetStudent(string studentId)
        {
            targetStudentId = studentId;
        }

        /// <summary>
        /// Connect to server (for button events)
        /// </summary>
        public void ConnectToServer()
        {
            _ = VirtualClassClient.Instance.Connect();
        }

        /// <summary>
        /// Disconnect from server (for button events)
        /// </summary>
        public void DisconnectFromServer()
        {
            VirtualClassClient.Instance.Disconnect();
        }

        #endregion
    }
}
