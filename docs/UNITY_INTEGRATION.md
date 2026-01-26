# Virtual Classroom - Unity Integration Guide

## Hızlı Başlangıç

### 1. Gereksinimler

| Gereksinim | Versiyon | Not |
|------------|----------|-----|
| Unity | 2021.3+ | LTS önerilir |
| NativeWebSocket | Latest | WebSocket kütüphanesi |
| TextMeshPro | Included | Unity ile birlikte gelir |
| Backend | Running | `localhost:8000` üzerinde çalışmalı(gelistirme ortamında) |

### 2. NativeWebSocket Kurulumu

Unity Package Manager'da:

1. **Window → Package Manager** açın
2. **+** butonuna tıklayın → "Add package from git URL"
3. Şu URL'yi yapıştırın:
```
https://github.com/endel/NativeWebSocket.git#upm
```

### 3. Scriptleri Projeye Ekleme

1. `Unity/Scripts/VirtualClass/` klasörünü Unity projenize kopyalayın
2. Hedef: `Assets/Scripts/VirtualClass/`

```
Assets/
└── Scripts/
    └── VirtualClass/
        ├── VirtualClassModels.cs    # Veri modelleri
        ├── VirtualClassEvents.cs    # Event sistemi
        ├── VirtualClassClient.cs    # WebSocket client
        ├── StudentAgentController.cs # Öğrenci kontrolcüsü
        ├── TeacherController.cs     # Öğretmen kontrolcüsü
        └── VirtualClassDemo.cs      # Demo/test scripti
```

---

## 4. Demo Sahne Kurulumu

### Hızlı Test

1. Boş bir sahne oluşturun
2. Empty GameObject ekleyin → "VirtualClassManager" adını verin
3. `VirtualClassDemo.cs` scripti ekleyin
4. Play tuşuna basın
5. **1-6 tuşları** ile komut gönderin

### Tam Kurulum

```
Hierarchy:
├── VirtualClassManager (VirtualClassDemo.cs)
├── Students
│   ├── Student_001 (StudentAgentController.cs)
│   │   ├── Model (3D karakter)
│   │   ├── SpeechBubble (Canvas + Text)
│   │   └── EmotionIndicator (Image)
│   └── Student_002 (StudentAgentController.cs)
└── TeacherUI (TeacherController.cs)
    ├── StudentSelector (TMP_Dropdown)
    ├── MessageInput (TMP_InputField)
    ├── ActionButtons (Button[])
    └── ResponseDisplay (TMP_Text)
```

---

## 5. StudentAgentController Kurulumu

### Inspector Ayarları

| Alan | Açıklama |
|------|----------|
| Student Id | Backend'deki öğrenci ID (örn: "student_001") |
| Display Name | UI'da gösterilecek isim |
| Animator | Karakter Animator referansı |
| Speech Bubble | Konuşma balonu GameObject |
| Speech Text | TMP_Text referansı |
| Emotion Indicator | Duygu göstergesi Image |

### Animator Setup

Animatör'de şu trigger'ları oluşturun:

```
Triggers:
- Happy
- Alert
- Wave
- Motivated
- Thinking
- Sit
- Stand
- Idle
- Confused
- Sleepy
- RaiseHand
```

---

## 6. API Referansı

### Bağlantı

```csharp
// Bağlan
await VirtualClassClient.Instance.Connect();

// Bağlantı durumu kontrolü
bool isConnected = VirtualClassClient.Instance.IsConnected;

// Bağlantıyı kes
VirtualClassClient.Instance.Disconnect();
```

### Öğretmen Komutları

```csharp
// Öğrenciyi öv
await VirtualClassClient.Instance.SendTeacherCommand(
    "student_001", 
    TeacherActionType.praise
);

// Uyarı gönder
await VirtualClassClient.Instance.SendTeacherCommand(
    "student_001", 
    TeacherActionType.warn
);

// Soru sor (AI yanıtı alır)
await VirtualClassClient.Instance.SendTeacherCommand(
    "student_001", 
    TeacherActionType.question,
    "Matematik dersinde integral nedir?"
);
```

### Öğrenci Aksiyonları

```csharp
// El kaldır
await VirtualClassClient.Instance.SendStudentAction(
    "student_001", 
    "raise_hand", 
    "Soru sormak istiyorum"
);

// Soruya cevap ver
await VirtualClassClient.Instance.SendStudentAction(
    "student_001", 
    "answer", 
    "Cevabım şudur..."
);
```

### Event Dinleme

```csharp
void Start()
{
    // AI yanıtı geldiğinde
    VirtualClassEvents.OnAIResponse += HandleResponse;
    
    // Bağlandığında
    VirtualClassEvents.OnConnected += () => Debug.Log("Bağlandı!");
    
    // Bağlantı koptuğunda
    VirtualClassEvents.OnDisconnected += () => Debug.Log("Koptu!");
}

void HandleResponse(AIResponse response)
{
    // Animasyonu tetikle
    animator.SetTrigger(response.GetAnimationTrigger());
    
    // Metni göster
    speechText.text = response.reply_text;
    
    // Duyguyu oku
    EmotionType emotion = response.GetEmotion();
}
```

---

## 7. Sunucu Yapılandırması

### VirtualClassClient Inspector

| Alan | Varsayılan | Açıklama |
|------|------------|----------|
| Server Host | localhost | Backend IP/domain |
| Server Port | 8000 | Backend port |
| Room Id | room_001 | Sınıf ID |
| Auth Token | dev-unity-token | Auth token |
| Auto Reconnect | true | Otomatik yeniden bağlan |
| Reconnect Delay | 3 | Yeniden bağlanma gecikmesi (sn) |

### Prodüksiyon için

```csharp
// Sunucu ayarlarını güncelle
var client = VirtualClassClient.Instance;
client.serverHost = "your-production-server.com";
client.serverPort = 8000;
client.authToken = "production-token-here";
await client.Connect();
```

---

## 8. Yanıt Formatı

Backend'den gelen AI yanıtı:

```json
{
    "animation": "happy",
    "reply_text": "Teşekkürler öğretmenim!",
    "emotion": "happy",
    "confidence": 1.0,
    "student_state": "attentive",
    "decision_trace": {
        "intent": "praise",
        "rule_applied": "primary_logic",
        "state_before": {"mood": "neutral", "attention_level": 0.85},
        "state_after": {"mood": "happy", "attention_level": 0.95}
    },
    "meta": {
        "timestamp": "2026-01-27T01:30:00.000Z",
        "source": "unity",
        "latency_ms": 45,
        "decision_id": "uuid-here"
    }
}
```

---

## 9. Troubleshooting

### "Cannot connect to server"
- Backend'in çalıştığından emin olun: `uvicorn main:app --reload`
- Firewall ayarlarını kontrol edin
- Doğru IP/port kullanıldığından emin olun

### "NativeWebSocket not found"
- Package Manager'dan NativeWebSocket'i yükleyin
- `using NativeWebSocket;` import'u ekleyin

### "No response from server"
- WebSocket bağlantısını kontrol edin
- Backend loglarını inceleyin
- Auth token'ın doğru olduğundan emin olun

---

## 10. Klasör Yapısı

```
Virtual-Class/
├── Unity/
│   └── Scripts/
│       └── VirtualClass/
│           ├── VirtualClassModels.cs
│           ├── VirtualClassEvents.cs
│           ├── VirtualClassClient.cs
│           ├── StudentAgentController.cs
│           ├── TeacherController.cs
│           └── VirtualClassDemo.cs
├── backend/                  # Python FastAPI
└── frontend/                 # React Dashboard
```

