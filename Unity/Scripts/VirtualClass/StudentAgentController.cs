/*
 * StudentAgentController.cs
 * Virtual Classroom - Unity Integration
 * 
 * Attach this to your student 3D model/agent.
 * Handles animations, speech bubbles, and state based on server responses.
 * 
 * Place this file in: Assets/Scripts/VirtualClass/
 */

using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace VirtualClass
{
    /// <summary>
    /// Controller for student agent in Unity scene
    /// </summary>
    [RequireComponent(typeof(Animator))]
    public class StudentAgentController : MonoBehaviour
    {
        #region Configuration

        [Header("Student Identity")]
        [Tooltip("Unique student ID - must match backend")]
        public string studentId = "student_001";

        [Tooltip("Display name for UI")]
        public string displayName = "Öğrenci";

        [Header("Components")]
        [Tooltip("Reference to the Animator component")]
        public Animator animator;

        [Tooltip("Speech bubble UI element (optional)")]
        public GameObject speechBubble;

        [Tooltip("Text component for speech bubble")]
        public TMP_Text speechText;

        [Tooltip("Emotion indicator UI (optional)")]
        public Image emotionIndicator;

        [Header("Settings")]
        [Tooltip("How long speech bubble stays visible")]
        public float speechDuration = 5f;

        [Tooltip("Automatically connect on start")]
        public bool autoConnect = true;

        #endregion

        #region State

        private EmotionType _currentEmotion = EmotionType.neutral;
        private StudentState _currentState = StudentState.idle;
        private Coroutine _speechCoroutine;

        public EmotionType CurrentEmotion => _currentEmotion;
        public StudentState CurrentState => _currentState;

        #endregion

        #region Unity Lifecycle

        private void Awake()
        {
            if (animator == null)
                animator = GetComponent<Animator>();
        }

        private void Start()
        {
            // Subscribe to events
            VirtualClassEvents.OnAIResponse += HandleAIResponse;
            VirtualClassEvents.OnConnected += OnConnected;
            VirtualClassEvents.OnDisconnected += OnDisconnected;

            // Hide speech bubble initially
            if (speechBubble != null)
                speechBubble.SetActive(false);

            // Auto-connect if enabled
            if (autoConnect)
            {
                StartCoroutine(AutoConnectRoutine());
            }
        }

        private void OnDestroy()
        {
            // Unsubscribe from events
            VirtualClassEvents.OnAIResponse -= HandleAIResponse;
            VirtualClassEvents.OnConnected -= OnConnected;
            VirtualClassEvents.OnDisconnected -= OnDisconnected;
        }

        private IEnumerator AutoConnectRoutine()
        {
            yield return new WaitForSeconds(0.5f);
            _ = VirtualClassClient.Instance.Connect();
        }

        #endregion

        #region Event Handlers

        private void OnConnected()
        {
            Debug.Log($"[{displayName}] Connected to Virtual Classroom!");
        }

        private void OnDisconnected()
        {
            Debug.Log($"[{displayName}] Disconnected from Virtual Classroom");
        }

        private void HandleAIResponse(AIResponse response)
        {
            // Process the response
            Debug.Log($"[{displayName}] Received: {response.reply_text}");

            // Update state
            _currentEmotion = response.GetEmotion();
            _currentState = response.GetStudentState();

            // Trigger animation
            PlayAnimation(response.GetAnimationTrigger());

            // Show speech bubble
            if (!string.IsNullOrEmpty(response.reply_text) && response.reply_text != "...")
            {
                ShowSpeech(response.reply_text);
            }

            // Update emotion indicator
            UpdateEmotionIndicator(_currentEmotion);
        }

        #endregion

        #region Animation

        /// <summary>
        /// Play an animation by trigger name
        /// </summary>
        public void PlayAnimation(string triggerName)
        {
            if (animator == null) return;

            // Reset all triggers first (optional, depends on your Animator setup)
            // animator.ResetTrigger("Happy");
            // animator.ResetTrigger("Sad");
            // etc.

            animator.SetTrigger(triggerName);
            Debug.Log($"[{displayName}] Playing animation: {triggerName}");
        }

        /// <summary>
        /// Set animator bool parameter
        /// </summary>
        public void SetAnimatorBool(string paramName, bool value)
        {
            if (animator != null)
                animator.SetBool(paramName, value);
        }

        #endregion

        #region Speech Bubble

        /// <summary>
        /// Show speech bubble with text
        /// </summary>
        public void ShowSpeech(string text, float duration = -1)
        {
            if (speechBubble == null || speechText == null) return;

            if (_speechCoroutine != null)
                StopCoroutine(_speechCoroutine);

            speechText.text = text;
            speechBubble.SetActive(true);

            float actualDuration = duration > 0 ? duration : speechDuration;
            _speechCoroutine = StartCoroutine(HideSpeechAfterDelay(actualDuration));
        }

        /// <summary>
        /// Hide speech bubble immediately
        /// </summary>
        public void HideSpeech()
        {
            if (speechBubble != null)
                speechBubble.SetActive(false);
        }

        private IEnumerator HideSpeechAfterDelay(float delay)
        {
            yield return new WaitForSeconds(delay);
            HideSpeech();
        }

        #endregion

        #region Emotion Indicator

        private void UpdateEmotionIndicator(EmotionType emotion)
        {
            if (emotionIndicator == null) return;

            Color color = emotion switch
            {
                EmotionType.happy => Color.green,
                EmotionType.sad => Color.blue,
                EmotionType.confused => Color.yellow,
                EmotionType.motivated => new Color(1f, 0.5f, 0f), // Orange
                EmotionType.sleepy => Color.gray,
                EmotionType.alert => Color.red,
                _ => Color.white
            };

            emotionIndicator.color = color;
        }

        #endregion

        #region Public Actions

        /// <summary>
        /// Raise hand action
        /// </summary>
        public void RaiseHand()
        {
            _ = VirtualClassClient.Instance.SendStudentAction(studentId, "raise_hand", "Soru sormak istiyorum");
            PlayAnimation("RaiseHand");
        }

        /// <summary>
        /// Answer question
        /// </summary>
        public void AnswerQuestion(string answer)
        {
            _ = VirtualClassClient.Instance.SendStudentAction(studentId, "answer", answer);
        }

        /// <summary>
        /// Request help
        /// </summary>
        public void RequestHelp()
        {
            _ = VirtualClassClient.Instance.SendStudentAction(studentId, "request_help", "Yardım istiyorum");
        }

        /// <summary>
        /// Generic action
        /// </summary>
        public void PerformAction(string actionType, string content = "")
        {
            _ = VirtualClassClient.Instance.SendStudentAction(studentId, actionType, content);
        }

        #endregion
    }
}
