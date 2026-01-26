/*
 * VirtualClassModels.cs
 * Virtual Classroom - Unity Integration
 * 
 * Data models matching the backend API.
 * Place this file in: Assets/Scripts/VirtualClass/
 */

using System;
using UnityEngine;

namespace VirtualClass
{
    #region Enums
    
    /// <summary>
    /// Available teacher action types
    /// </summary>
    public enum TeacherActionType
    {
        praise,
        warn,
        encourage,
        question,
        command_sit,
        command_stand,
        ignore,
        greeting
    }

    /// <summary>
    /// Student emotional states
    /// </summary>
    public enum EmotionType
    {
        neutral,
        happy,
        sad,
        confused,
        motivated,
        sleepy,
        alert
    }

    /// <summary>
    /// Student behavioral states
    /// </summary>
    public enum StudentState
    {
        attentive,
        distracted,
        sleepy,
        confused,
        idle
    }

    #endregion

    #region Request Models

    /// <summary>
    /// Payload for student actions sent to the server
    /// </summary>
    [Serializable]
    public class StudentActionPayload
    {
        public string type;
        public StudentActionData data;

        public StudentActionPayload(string studentId, string actionType, string content = "")
        {
            type = "student_action";
            data = new StudentActionData
            {
                student_id = studentId,
                action_type = actionType,
                content = content,
                timestamp = DateTime.UtcNow.ToString("o")
            };
        }
    }

    [Serializable]
    public class StudentActionData
    {
        public string student_id;
        public string action_type;
        public string content;
        public string timestamp;
    }

    /// <summary>
    /// Teacher input request (for REST API fallback)
    /// </summary>
    [Serializable]
    public class TeacherInputRequest
    {
        public string source = "unity";
        public string teacher_id;
        public string student_id;
        public string teacher_action;
        public string input_type = "text";
        public string content;
    }

    #endregion

    #region Response Models

    /// <summary>
    /// AI Response from the server
    /// </summary>
    [Serializable]
    public class AIResponse
    {
        public string animation;
        public string reply_text;
        public string emotion;
        public float confidence;
        public string student_state;
        public DecisionTrace decision_trace;
        public ResponseMeta meta;

        /// <summary>
        /// Get the animation trigger name for Animator
        /// </summary>
        public string GetAnimationTrigger()
        {
            // Map server animation names to Unity animator triggers
            return animation switch
            {
                "happy" => "Happy",
                "alert" => "Alert",
                "wave" => "Wave",
                "motivated" => "Motivated",
                "thinking" => "Thinking",
                "thinking_pose" => "Thinking",
                "sit" => "Sit",
                "stand" => "Stand",
                "idle" => "Idle",
                "confused" => "Confused",
                "sleepy" => "Sleepy",
                "yawn" => "Yawn",
                _ => "Idle"
            };
        }

        /// <summary>
        /// Parse emotion string to enum
        /// </summary>
        public EmotionType GetEmotion()
        {
            return Enum.TryParse<EmotionType>(emotion, true, out var result) 
                ? result 
                : EmotionType.neutral;
        }

        /// <summary>
        /// Parse student state string to enum
        /// </summary>
        public StudentState GetStudentState()
        {
            return Enum.TryParse<StudentState>(student_state, true, out var result) 
                ? result 
                : StudentState.idle;
        }
    }

    [Serializable]
    public class DecisionTrace
    {
        public string intent;
        public string rule_applied;
        public StateData state_before;
        public StateData state_after;
    }

    [Serializable]
    public class StateData
    {
        public string mood;
        public float attention_level;
        public float energy_level;
        public string current_activity;
    }

    [Serializable]
    public class ResponseMeta
    {
        public string timestamp;
        public string source;
        public int latency_ms;
        public string decision_id;
    }

    #endregion

    #region WebSocket Messages

    /// <summary>
    /// Wrapper for incoming WebSocket messages
    /// </summary>
    [Serializable]
    public class WebSocketMessage
    {
        public string type;
        public string data; // JSON string, parse based on type
    }

    #endregion
}
