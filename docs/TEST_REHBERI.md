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

### Örnek İstek (Postman Screenshot)
![Postman İstek Örneği](/docs/media/image.png)
![Postman İstek Örneği](/docs/media/image_web.png)

### Gerçek Test Sonucu (200 OK)

```json
{
    "animation": "wave",
    "reply_text": "Merhaba!",
    "emotion": "happy",
    "confidence": 0.9,
    "student_state": "attentive",
    "decision_trace": {
        "intent": "greeting",
        "rule_applied": "primary_logic",
        "state_before": {
            "mood": "neutral",
            "attention_level": 0.8,
            "energy_level": 0.8,
            "current_activity": "listening"
        },
        "state_after": {
            "mood": "neutral",
            "attention_level": 0.8,
            "energy_level": 0.8,
            "current_activity": "listening"
        }
    },
    "meta": {
        "timestamp": "2026-01-28T12:51:28.918875",
        "source": "unity",
        "latency_ms": 0,
        "decision_id": "8c7b147b-e7ff-4a9d-8e24-ccc6f7a1e2b6"
    }
}
```

Bu sonuç, sistemin hem niyeti (greeting) doğru anladığını hem de Unity için gerekli animasyon ve duygu verilerini başarıyla ürettiğini gösterir.

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

---

## 3. LLM (Yapay Zeka) Testi

Backend, basit komutları (merhaba, aferin vb.) kural tabanlı olarak hızlıca yanıtlar. Daha karmaşık veya bilinmeyen sorular sorulduğunda ise **Groq (Llama 3)** veya **Gemini** devreye girer.

### LLM'i Tetikleme Senaryosu

- **Metod:** `POST`
- **URL:** `http://localhost:8000/api/v1/teacher/input`
- **Body (JSON):**

```json
{
  "source": "web",
  "teacher_id": "test_teacher_1",
  "student_id": "student_001",
  "input_type": "text",
  "content": "Güneş sistemindeki en büyük gezegen hangisidir?"
}
```
## Gercek Test(POSTMAN)
![Postman İstek Örneği](/docs/media/llm_web.png)


### Yanıt

```json
{
    "animation": "thinking_pose",
    "reply_text": "Jüpiter, güneş sistemindeki en büyük gezegen.",
    "emotion": "motivated",
    "confidence": 0.4,
    "student_state": "attentive",
    "decision_trace": {
        "intent": "unknown",
        "rule_applied": "primary_logic",
        "state_before": {
            "mood": "neutral",
            "attention_level": 0.8,
            "energy_level": 0.8,
            "current_activity": "listening"
        },
        "state_after": {
            "mood": "neutral",
            "attention_level": 0.8,
            "energy_level": 0.8,
            "current_activity": "listening"
        }
    },
    "meta": {
        "timestamp": "2026-01-28T13:04:00.832555",
        "source": "web",
        "latency_ms": 381,
        "decision_id": "c1de5cc2-9529-49f0-bc03-79d8b3576655"
    }
}
```

Bu durumda yanıt kural tabanlı değil, yapay zeka tarafından üretileceği için şu detaylara dikkat edin:
1. **Rule Applied**: `None` veya kural uygulanmadığını belirten bir değer olmalı.
2. **Confidence**: LLM'den gelen güven skoru (genelde 0.8-1.0 arası).
3. **Reply Text**: "Güneş sistemindeki en büyük gezegen Jüpiter'dir..." gibi anlamlı bir cümle.

