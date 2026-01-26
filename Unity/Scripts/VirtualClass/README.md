# Virtual Classroom - Unity Scripts

Bu klasör, Virtual Classroom backend'ine bağlanmak için gerekli tüm C# scriptlerini içerir.

## Kurulum

### 1. NativeWebSocket Kurulumu
Unity Package Manager'da:
- **+** → "Add package from git URL"
- `https://github.com/endel/NativeWebSocket.git#upm`

### 2. Scriptleri Kopyala
Bu klasörü Unity projenize kopyalayın:
```
Assets/Scripts/VirtualClass/
```

### 3. Demo Test
1. Boş sahne oluşturun
2. Empty GameObject'e `VirtualClassDemo.cs` ekleyin
3. Play tuşuna basın
4. **1-6 tuşları** ile test edin

## Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `VirtualClassModels.cs` | API veri modelleri |
| `VirtualClassEvents.cs` | Event sistemi |
| `VirtualClassClient.cs` | WebSocket client (singleton) |
| `StudentAgentController.cs` | Öğrenci karakter kontrolcüsü |
| `TeacherController.cs` | Öğretmen UI kontrolcüsü |
| `VirtualClassDemo.cs` | Hızlı test scripti |

## Hızlı Başlangıç

```csharp
// Bağlan
await VirtualClassClient.Instance.Connect();

// Öğretmen komutu gönder
await VirtualClassClient.Instance.SendTeacherCommand(
    "student_001", 
    TeacherActionType.praise
);

// Yanıt dinle
VirtualClassEvents.OnAIResponse += (response) => {
    Debug.Log(response.reply_text);
    animator.SetTrigger(response.GetAnimationTrigger());
};
```

## Backend Gereksinimi

Backend'in çalışıyor olması gerekir:
```bash
cd backend
uvicorn main:app --reload
```

---
Detaylı dokümantasyon: `/docs/UNITY_INTEGRATION.md`
