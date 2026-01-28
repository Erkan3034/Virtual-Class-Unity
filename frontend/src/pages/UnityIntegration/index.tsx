import React from 'react';
import {
    Code2,
    Box,
    Zap,
    Globe,
    Terminal,
    ChevronRight,
    Info,
    Layers,
    Workflow,
    Mic
} from 'lucide-react';

export const UnityIntegration: React.FC = () => {
    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <Box className="text-indigo-400" size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Unity Entegrasyonu</h1>
                    </div>
                    <p className="text-slate-500 max-w-2xl">
                        Unity istemcilerini Virtual Classroom AI Karar Mekanizmasına bağlamak için teknik rehber ve kod referansları.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-indigo-400 bg-indigo-900/20 px-3 py-1.5 rounded-full border border-indigo-900/30 text-xs font-bold uppercase tracking-widest">
                        v1.2.0-kararlı
                    </div>
                </div>
            </div>

            {/* Core Workflow Diagrams */}
            <div className="grid grid-cols-12 gap-6">
                <section className="col-span-12 lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Workflow size={120} />
                    </div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <Workflow size={20} className="text-indigo-400" /> Veri Döngüsü ve Senkronizasyon
                    </h2>

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                        <div className="z-10 bg-slate-800 border border-slate-700 p-4 rounded-xl text-center min-w-[140px]">
                            <div className="text-indigo-400 font-bold text-xs mb-1 uppercase">Unity İstemci</div>
                            <div className="text-white text-sm">Etkileşim Gönder</div>
                        </div>

                        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-indigo-500/50 via-slate-700 to-indigo-500/50 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-slate-900 rounded-full border border-slate-700">
                                <Zap size={14} className="text-amber-400" />
                            </div>
                        </div>

                        <div className="z-10 bg-indigo-600 p-4 rounded-xl text-center min-w-[140px] shadow-lg shadow-indigo-900/40">
                            <div className="text-indigo-100 font-bold text-xs mb-1 uppercase">AI Beyin</div>
                            <div className="text-white text-sm">Karar Motoru</div>
                        </div>

                        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-indigo-500/50 via-slate-700 to-indigo-500/50 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-slate-900 rounded-full border border-slate-700">
                                <ChevronRight size={14} className="text-indigo-400" />
                            </div>
                        </div>

                        <div className="z-10 bg-slate-800 border border-slate-700 p-4 rounded-xl text-center min-w-[140px]">
                            <div className="text-emerald-400 font-bold text-xs mb-1 uppercase">Unity İstemci</div>
                            <div className="text-white text-sm">Animasyon Oynat</div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">İstek Akışı</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Etkileşimler REST veya WebSockets üzerinden <code className="text-indigo-400">TeacherInputRequest</code> olarak gönderilir.
                                Backend niyet, durum ve kuralları işler.
                            </p>
                        </div>
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Yanıt Yönetimi</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Unity, belirli animasyon tetikleyicileri, metin yanıtları ve güncellenmiş öğrenci durumlarını içeren bir <code className="text-emerald-400">UnityResponse</code> alır.
                            </p>
                        </div>
                    </div>
                </section>

                {/* API Specs */}
                <section className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-20">
                            <Globe size={100} />
                        </div>
                        <h3 className="font-bold flex items-center gap-2 mb-2">
                            <Globe size={18} /> API Adresi
                        </h3>
                        <p className="text-indigo-100 text-sm mb-4">Yerel veya Prodüksiyon API URL'si</p>
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 font-mono text-xs border border-white/20 select-all">
                            http://localhost:8000/api/v1/teacher/input
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                        <h3 className="font-bold text-white flex items-center gap-2 mb-4 text-sm">
                            <Layers size={16} className="text-indigo-400" /> Animasyon Tetikleyicileri
                        </h3>
                        <div className="space-y-2">
                            {['happy_nod', 'excited_raise_hand', 'confused_head_scratch', 'sleepy_yawn', 'thinking_pose'].map(trigger => (
                                <div key={trigger} className="flex justify-between items-center bg-slate-950/40 p-2 rounded-lg border border-slate-800 text-[10px] font-mono group hover:border-indigo-500/50 transition-colors">
                                    <span className="text-slate-400">{trigger}</span>
                                    <span className="text-indigo-400 opacity-0 group-hover:opacity-100 uppercase font-bold tracking-tighter">Hazır</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* Scripts & Assets Integration */}
            <div className="grid grid-cols-1 overflow-hidden">
                <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Code2 size={120} />
                    </div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <Code2 size={20} className="text-indigo-400" /> Script ve Varlık Entegrasyonu
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                <ChevronRight size={14} className="text-indigo-400" /> Adım 1: Scriptleri Kopyalayın
                            </h3>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                Proje ana dizinindeki <code className="text-white">unity_assets/</code> veya <code className="text-white">Unity/Scripts/VirtualClass/</code> klasöründeki scriptleri Unity projenizin <code className="text-indigo-400">Assets/Scripts/VirtualClass/</code> yoluna kopyalayın.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">AIClient.cs (Hızlı Başlangıç)</h4>
                                <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                                    Tek bir script ile REST API üzerinden hızlıca bağlantı kurmanızı sağlar. Basit triggerlar ve hızlı testler için idealdir.
                                </p>
                                <div className="text-[10px] text-slate-500 font-mono">
                                    Konum: /unity_assets/AIClient.cs
                                </div>
                            </div>
                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">VirtualClass Paketi (Tam Entegrasyon)</h4>
                                <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                                    WebSocket tabanlı, gerçek zamanlı ve çoklu öğrenci desteği sunan gelişmiş script seti.
                                </p>
                                <div className="text-[10px] text-slate-500 font-mono">
                                    Konum: /Unity/Scripts/VirtualClass/*
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                <ChevronRight size={14} className="text-indigo-400" /> Adım 2: NativeWebSocket Kurulumu
                            </h3>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                Eğer tam entegrasyon (WebSocket) kullanacaksanız, Unity Package Manager üzerinden NativeWebSocket paketini eklemelisiniz:
                            </p>
                            <div className="bg-black/40 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-indigo-300 select-all">
                                https://github.com/endel/NativeWebSocket.git#upm
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* C# Implementation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contract definition */}
                <section className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center font-mono text-[10px]">
                        <span className="text-slate-500 flex items-center gap-2"><Code2 size={12} /> Models.cs</span>
                        <span className="text-slate-700">UNITY SERIALIZABLE</span>
                    </div>
                    <div className="p-0 flex-1 bg-black relative">
                        <pre className="p-5 text-indigo-300 font-mono text-xs overflow-x-auto leading-relaxed">
                            {`[System.Serializable]
public class AIRequest {
    public string source = "unity";
    public string teacher_id;
    public string student_id;
    public string input_type = "text";
    public string content;
}

[System.Serializable]
public class AIResponse {
    public string animation;
    public string reply_text;
    public string emotion;
}`}
                        </pre>
                    </div>
                </section>

                {/* Example Implementation */}
                <section className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center font-mono text-[10px]">
                        <span className="text-slate-500 flex items-center gap-2"><Terminal size={12} /> AIClient.cs</span>
                        <span className="text-slate-700">CORE LOGIC</span>
                    </div>
                    <div className="p-0 flex-1 bg-black relative">
                        <pre className="p-5 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
                            {`IEnumerator PostInteraction(string text) {
    var data = new AIRequest { content = text };
    string json = JsonUtility.ToJson(data);

    var req = new UnityWebRequest(url, "POST");
    req.uploadHandler = new UploadHandlerRaw(...);
    req.SetRequestHeader("Content-Type", "application/json");

    yield return req.SendWebRequest();
    
    if(req.result == Success) {
        var res = JsonUtility.FromJson<AIResponse>(...);
        animator.SetTrigger(res.animation);
    }
}`}
                        </pre>
                    </div>
                </section>
            </div>

            {/* Voice & Base64 Handling */}
            <div className="grid grid-cols-1 overflow-hidden">
                <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <Mic size={20} className="text-rose-400" /> Ses ve Audio Entegrasyonu
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                <ChevronRight size={14} className="text-indigo-400" /> Seçenek A: Unity Tarafı STT (Önerilen)
                            </h3>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                Unity'nin <code className="text-indigo-400">Speech-To-Text</code> SDK'sını kullanarak sesi yerel olarak metne dönüştürün.
                                Ortaya çıkan metni <code className="text-white">content</code> alanında gönderin.
                            </p>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[10px] text-indigo-300">
                                {`request.input_type = "text";\nrequest.content = "Ödevini neden yapmadın?";`}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                <ChevronRight size={14} className="text-indigo-400" /> Seçenek B: Backend Tarafı İşleme
                            </h3>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                Ham ses verisini **Base64** formatında kodlayarak doğrudan gönderin. AI Beyni karar mekanizmasından önce
                                sinirsel deşifre işlemi uygulayacaktır.
                            </p>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[10px] text-rose-300">
                                {`request.input_type = "voice";\nrequest.content = "BASE64_SES_VERISI_BURAYA...";`}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Extra Info */}
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6 flex gap-4 items-start">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Info className="text-indigo-400" size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white mb-1">Üretim Ortamı İçin En İyi Uygulamalar</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Gerçek zamanlı çoklu ajan ortamları için durum güncellemelerinde <strong>WebSockets</strong> kullanılması önerilir.
                        Burada gösterilen REST uç noktası, geliştirici tetikleyicileri veya öğretmen panelinden yapılan manuel müdahaleler için uygundur.
                        Detaylı şema bilgileri için <span className="text-indigo-400 hover:underline cursor-pointer">API Sözleşme dokümanını</span> inceleyin.
                    </p>
                </div>
            </div>
        </div>
    );
};
