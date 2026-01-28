# Sanal Sınıf Test Rehberi

Bu rehber, projeyi **Postman** ve **Unity** ile nasıl test edeceğinizi adım adım açıklar.

## 1. Postman ile API Testi

Backend'in çalıştığını ve doğru yanıt verdiğini doğrulamak için REST API'yi kullanacağız.

### Ön Hazırlık
1. **Backend'i Başlatın:** `backend` klasöründe `uvicorn main:app --reload` komutunu çalıştırın.
2. **Postman'i Açın:** Yeni bir "Request" oluşturun.

### Test Senaryosu: Öğretmen Komutu Gönderme (Teacher Input)

Bu komut, sanki öğretmen panelinden veya Unity'den bir girdi gelmiş gibi yapay zekayı tetikler.

- **Metod:** `POST`
- **URL:** `http://localhost:8000/api/v1/teacher/input`
- **Headers:**
  - Key: `Content-Type`
  - Value: `application/json`
- **Body (Raw JSON):**

```json
{
  "source": "web",
  "teacher_id": "test_teacher_1",
  "student_id": "student_001",
  "input_type": "text",
  "content": "Merhaba, bugün nasılsın?"
}
```

### Beklenen Yanıt (200 OK)

```json
{
    "animation": "wave",
    "reply_text": "Merhaba! İyiyim, teşekkürler öğretmenim.",
    "emotion": "happy",
    "confidence": 0.957,
    "student_state": "attentive",
    "decision_trace": {
        "intent": "greeting",
        "state_before": { ... },
        "state_after": { ... }
    },
    "meta": { ... }
}
```

Eğer bu yanıtı alıyorsanız, Backend (YZ, NLP) sorunsuz çalışıyor demektir.

---

## 2. Unity Testleri

Unity tarafında test yapmak için projenin **Play Mode** özelliğini kullanacağız.

### Ön Hazırlık
1. Backend'in çalıştığından emin olun (Port 8000).
2. Unity Projesini açın (`Virtual-Class-Unity`).

### Bağlantı ve İletişim Testi

1. **Sahneyi Açın:** `Assets/Scenes/DemoScene` (veya oluşturduğunuz test sahnesi).
2. **Play Tuşuna Basın:** Unity editöründe oyunu başlatın.
3. **Console'u Kontrol Edin:**
   - Yeşil renkte `Unity connected` veya `Connected to WebSocket` mesajını görmelisiniz.
   - Eğer kırmızı hata varsa (Connection refused), backend çalışmıyor veya port kapalı olabilir.

### Öğrenci Etkileşim Testi (Demo Script ile)

Eğer `VirtualClassDemo.cs` sahnedeyse, klavye kısayolları ile test yapabilirsiniz:

- **Tuş 1 (Praise):** Öğrenciye övgü gönderir -> Öğrenci sevinmeli (`Happy` animasyonu).
- **Tuş 2 (Warn):** Öğrenciye uyarı gönderir -> Öğrenci utanmalı/üzülmeli (`Sad` veya `Shy` animasyonu).
- **Tuş 3 (Question):** Bir soru sorar -> Öğrenci düşünüp cevap verir (`Thinking` -> `Talk`).

### Manuel Debug Testi

Backend konsolunda veya tarayıcıdaki Debug Dashboard'da (`http://localhost:5173/debug`) Unity'den gelen etkileşimleri anlık görebilirsiniz.

1. Unity'de bir tuşa basın (örn: 1).
2. Backend terminalinde `INFO: ... POST /api/v1/teacher/input` logunu görün.
3. Frontend Debug panelinde yeni bir satır eklendiğini doğrulayın.
