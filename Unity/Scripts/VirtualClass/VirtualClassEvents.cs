/*
 * VirtualClassEvents.cs
 * Virtual Classroom - Unity Integration
 * 
 * Event system for handling server responses.
 * Place this file in: Assets/Scripts/VirtualClass/
 */

using System;
using UnityEngine;
using UnityEngine.Events;

namespace VirtualClass
{
    #region Unity Events

    /// <summary>
    /// Event fired when an AI response is received
    /// </summary>
    [Serializable]
    public class AIResponseEvent : UnityEvent<AIResponse> { }

    /// <summary>
    /// Event fired when connection status changes
    /// </summary>
    [Serializable]
    public class ConnectionStatusEvent : UnityEvent<bool> { }

    /// <summary>
    /// Event fired when an error occurs
    /// </summary>
    [Serializable]
    public class ErrorEvent : UnityEvent<string> { }

    #endregion

    /// <summary>
    /// Global event manager for Virtual Classroom events
    /// </summary>
    public static class VirtualClassEvents
    {
        #region Events

        /// <summary>
        /// Fired when any AI response is received from the server
        /// </summary>
        public static event Action<AIResponse> OnAIResponse;

        /// <summary>
        /// Fired when a specific student receives a response
        /// </summary>
        public static event Action<string, AIResponse> OnStudentResponse;

        /// <summary>
        /// Fired when connection to server is established
        /// </summary>
        public static event Action OnConnected;

        /// <summary>
        /// Fired when connection to server is lost
        /// </summary>
        public static event Action OnDisconnected;

        /// <summary>
        /// Fired when a connection error occurs
        /// </summary>
        public static event Action<string> OnConnectionError;

        /// <summary>
        /// Fired when teacher sends a command (for logging/UI)
        /// </summary>
        public static event Action<string, TeacherActionType> OnTeacherCommand;

        #endregion

        #region Internal Triggers

        internal static void TriggerAIResponse(AIResponse response)
        {
            OnAIResponse?.Invoke(response);
        }

        internal static void TriggerStudentResponse(string studentId, AIResponse response)
        {
            OnStudentResponse?.Invoke(studentId, response);
        }

        internal static void TriggerConnected()
        {
            OnConnected?.Invoke();
        }

        internal static void TriggerDisconnected()
        {
            OnDisconnected?.Invoke();
        }

        internal static void TriggerConnectionError(string error)
        {
            OnConnectionError?.Invoke(error);
        }

        internal static void TriggerTeacherCommand(string studentId, TeacherActionType action)
        {
            OnTeacherCommand?.Invoke(studentId, action);
        }

        #endregion

        #region Cleanup

        /// <summary>
        /// Clear all event subscriptions (call on scene unload)
        /// </summary>
        public static void ClearAllSubscriptions()
        {
            OnAIResponse = null;
            OnStudentResponse = null;
            OnConnected = null;
            OnDisconnected = null;
            OnConnectionError = null;
            OnTeacherCommand = null;
        }

        #endregion
    }
}
