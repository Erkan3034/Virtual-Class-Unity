# Sanal Sınıf Yapay Zeka Sistemi (MVP)

Unity tabanlı sanal sınıf için, yapay zeka destekli öğrenci-öğretmen etkileşimi sunan bir MVP arka uç/ön yüz sistemi. Bu sistem, sanal öğrenci ajanlarını simüle etmek ve kontrol etmek için modüler bir Python arka ucu (FastAPI) ve React tabanlı bir öğretmen paneli kullanır.

## Sistem Mimarisi

Sistem akışı, veri akışı ve bileşenlerin detaylı görünümü için lütfen [Sistem Mimarisi Şeması](docs/FLOW_DIAGRAM.md)'na bakın.

- **Backend:** Python FastAPI (Modüler, Genişletilebilir, Senkron/Asenkron Desteği)
- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Yapay Zeka Motoru:** Karar Verme için Google Gemini & Groq (Llama 3)
- **Unity:** C# İstemci (WebSocket & REST Entegrasyonu)

##  Aktif Özellikler

### 1. Yapay Zeka Destekli Karar Hattı (Pipeline)
Sistemin çekirdeği, girdileri aşamalı olarak işleyen `ai/pipeline.py` dosyasıdır:
- **NLP Analizörü:** Yaygın niyetler (Selamlaşma, Övgü, Disiplin) için kural tabanlı tespit.
- **Bilgi Tabanı (Knowledge Base):** Anlık geri bildirimler için önceden tanımlanmış yanıtlar.
- **LLM Entegrasyonu:** Karmaşık veya bilinmeyen sorguları işlemek için Groq/Gemini kullanımı.

### 2. Çoklu İstemci Senkronizasyonu
- **WebSocket Yöneticisi:** Durum değişikliklerini bağlı tüm istemcilere (Unity & Web) yayınlar.
- **Role Dayalı Mesajlaşma:** Belirli rollere (`unity`, `debug`, `teacher`) yönlendirilmiş mesajlar.

### 3. Öğretmen Paneli & Hata Ayıklama Araçları
- **Öğretmen Paneli:** Manuel komutlar göndermek ve YZ davranışını geçersiz kılmak için arayüz.
- **Debug Dashboard:** Yapay zekanın "düşünce sürecini" (gecikme, güven, seçilen duygu) gerçek zamanlı izleme.

##  Kurulum ve Hazırlık

### Ön Gereksinimler
- Python 3.9+
- Node.js 18+
- npm

### 1. Backend Kurulumu
1. Backend klasörüne gidin:
   ```bash
   cd backend
   ```
2. Sanal ortam oluşturun ve aktif edin:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Bağımlılıkları yükleyin:
   ```bash
   pip install -r requirements.txt
   ```
4. **Konfigürasyon:** `backend` klasöründe API anahtarlarınızla bir `.env` dosyası oluşturun:
   ```env
   GEMINI_API_KEY=your_gemini_key
   GROQ_API_KEY=your_groq_key
   DEBUG=True
   SECRET_KEY=your_secret_key
   ```
   *(Not: Ekip çalışması yapıyorsanız anahtarlar için `.env.example` dosyasına bakın veya isteyin)*

5. Sunucuyu çalıştırın:
   ```bash
   uvicorn main:app --reload
   ```
   - API Dokümantasyonu: `http://localhost:8000/docs`
   - WebSocket: `ws://localhost:8000/ws/v1/classroom/{room_id}`

### 2. Frontend Kurulumu
1. Frontend klasörüne gidin:
   ```bash
   cd frontend
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Geliştirme sunucusunu çalıştırın:
   ```bash
   npm run dev
   ```
   - Uygulama: `http://localhost:5173`

#  Nasıl Kullanılır

1. **Servisleri Başlatın:** Hem Backend (Port 8000) hem de Frontend (Port 5173) çalıştığından emin olun.
2. **Öğretmen Panelini Açın:** Tarayıcınızda `http://localhost:5173` adresine gidin.
3. **Unity Bağlantısı (Opsiyonel):** Unity ile geliştirme yapıyorsanız, istemciyi çalıştırarak otomatik olarak `ws://localhost:8000` adresine bağlanmasını sağlayın.
4. **Komut Gönderin:**
   - Panel üzerinden "Otur", "Soruyu Cevapla" gibi komutlar gönderin.
   - Yapay zeka niyeti işleyecek, bir animasyon/duygu seçecek ve bunu yayınlayacaktır.
   - Yanıtı paneldeki Debug bölümünde görebilirsiniz.

## Proje Yapısı

- `backend/app`: Temel uygulama mantığı (Pipeline, Modeller).
- `backend/ai`: Karar motorları ve entegrasyonlar (Groq, Gemini).
- `backend/nlp`: Doğal Dil İşleme ve Bilgi Tabanı.
- `backend/ws`: WebSocket bağlantı yöneticisi.
- `docs/`: Detaylı tasarım belgeleri ve API özellikleri.
