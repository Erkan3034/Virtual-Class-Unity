# Unity Sesli Komut Entegrasyon Rehberi 

Bu döküman, Unity tarafında kaydedilen seslerin backend sistemine nasıl gönderileceğini ve nasıl test edileceğini açıklar.

## 1. Veri Formatı
Backend, ses verisini **Base64** formatında beklemektedir. Unity'de `AudioClip` verisini yakaladıktan sonra bunu bir byte array'e (WAV formatında) çevirip ardından Base64 string'e dönüştürmeniz gerekir.

## 2. WebSocket Mesaj Yapısı
Sesli komutu göndermek için aşağıdaki JSON paketini WebSocket üzerinden göndermelisiniz:

**Endpoint:** `ws://localhost:8000/ws/v1/classroom/{room_id}?token={token}`

**Mesaj:**
```json
{
  "type": "VOICE_INPUT",
  "student_id": "student_001",
  "audio_base64": "UklGRiQAAABXQVZFZm10IBAAAA..." // Buraya Base64 string gelecek
}
```

## 3. Backend Tepkisi (Response)
Ses başarıyla işlendiğinde, backend size standart bir `UnityResponse` paketi dönecektir:
```json
{
  "animation": "happy",
  "reply_text": "Anladım öğretmenim!",
  "emotion": "happy",
  "confidence": 0.98,
  "student_state": "attentive",
  "meta": {
    "latency_ms": 450,
    "decision_id": "uuid-v4-id"
  }
}
```

## 4. Test Etme (Hızlı Başlangıç)
Eğer henüz Unity tarafında kayıt sistemi hazır değilse, backend'in doğru çalıştığını manuel test etmek için:

1. Backend klasöründe terminal açın.
2. `python generate_test_wav.py` komutuyla örnek bir dosya oluşturun.
3. `python verify_voice.py` komutuyla bu dosyanın API'ye gönderilmesini simüle edin.

## Önemli Notlar
- **Whisper API:** Backend'de Groq Whisper-large-v3 modeli kullanılıyor, bu yüzden Türkçe anlama kapasitesi çok yüksektir.
- **Süre:** Ses dosyalarının 10 saniyeden kısa tutulması performans (gecikme) açısından önerilir.
- **Hata Yönetimi:** Eğer ses boş veya anlaşılmazsa, sistem `unknown` intent'i ile güvenli bir cevap dönecektir.
