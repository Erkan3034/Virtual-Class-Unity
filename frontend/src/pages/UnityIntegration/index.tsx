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
                        <h1 className="text-3xl font-bold text-white tracking-tight">Unity Integration</h1>
                    </div>
                    <p className="text-slate-500 max-w-2xl">
                        Technical guide and code references for connecting Unity clients to the Virtual Classroom AI Decision Engine.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-indigo-400 bg-indigo-900/20 px-3 py-1.5 rounded-full border border-indigo-900/30 text-xs font-bold uppercase tracking-widest">
                        v1.2.0-stable
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
                        <Workflow size={20} className="text-indigo-400" /> Data Lifecycle & Synchronization
                    </h2>

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                        <div className="z-10 bg-slate-800 border border-slate-700 p-4 rounded-xl text-center min-w-[140px]">
                            <div className="text-indigo-400 font-bold text-xs mb-1 uppercase">Unity Client</div>
                            <div className="text-white text-sm">Send Interaction</div>
                        </div>

                        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-indigo-500/50 via-slate-700 to-indigo-500/50 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-slate-900 rounded-full border border-slate-700">
                                <Zap size={14} className="text-amber-400" />
                            </div>
                        </div>

                        <div className="z-10 bg-indigo-600 p-4 rounded-xl text-center min-w-[140px] shadow-lg shadow-indigo-900/40">
                            <div className="text-indigo-100 font-bold text-xs mb-1 uppercase">AI Brain</div>
                            <div className="text-white text-sm">Decision Engine</div>
                        </div>

                        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-indigo-500/50 via-slate-700 to-indigo-500/50 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-slate-900 rounded-full border border-slate-700">
                                <ChevronRight size={14} className="text-indigo-400" />
                            </div>
                        </div>

                        <div className="z-10 bg-slate-800 border border-slate-700 p-4 rounded-xl text-center min-w-[140px]">
                            <div className="text-emerald-400 font-bold text-xs mb-1 uppercase">Unity Client</div>
                            <div className="text-white text-sm">Play Animation</div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Request Flow</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                interaction is sent via REST or WebSockets as a <code className="text-indigo-400">TeacherInputRequest</code>.
                                The backend processes intent, state, and rules.
                            </p>
                        </div>
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Response Handling</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Unity receives a <code className="text-emerald-400">UnityResponse</code> containing specific
                                animation triggers, reply text, and modified student states.
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
                            <Globe size={18} /> Endpoint URL
                        </h3>
                        <p className="text-indigo-100 text-sm mb-4">Production or Local API gateway</p>
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 font-mono text-xs border border-white/20 select-all">
                            http://localhost:8000/api/v1/teacher/input
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                        <h3 className="font-bold text-white flex items-center gap-2 mb-4 text-sm">
                            <Layers size={16} className="text-indigo-400" /> Animation Triggers
                        </h3>
                        <div className="space-y-2">
                            {['happy_nod', 'excited_raise_hand', 'confused_head_scratch', 'sleepy_yawn', 'thinking_pose'].map(trigger => (
                                <div key={trigger} className="flex justify-between items-center bg-slate-950/40 p-2 rounded-lg border border-slate-800 text-[10px] font-mono group hover:border-indigo-500/50 transition-colors">
                                    <span className="text-slate-400">{trigger}</span>
                                    <span className="text-indigo-400 opacity-0 group-hover:opacity-100 uppercase font-bold tracking-tighter">Ready</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* C# Implementation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contract definition */}
                <section className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center font-mono text-[10px]">
                        <span className="text-slate-500 flex items-center gap-2"><Code2 size={12} /> Contracts.cs</span>
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
                        <Mic size={20} className="text-rose-400" /> Audio / Voice Integration
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                <ChevronRight size={14} className="text-indigo-400" /> Option A: Unity-Side STT (Recommended)
                            </h3>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                Use Unity's <code className="text-indigo-400">Speech-To-Text</code> SDK to transcribe audio locally.
                                Send the resulting string in the <code className="text-white">content</code> field.
                            </p>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[10px] text-indigo-300">
                                {`request.input_type = "text";\nrequest.content = "Ödevini neden yapmadın?";`}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                <ChevronRight size={14} className="text-indigo-400" /> Option B: Backend-Side Transcription
                            </h3>
                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                Encode raw audio to **Base64** and send it directly. The AI Brain will perform
                                neural transcription before the decision pipeline.
                            </p>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[10px] text-rose-300">
                                {`request.input_type = "voice";\nrequest.content = "BASE64_AUDIO_DATA_HERE...";`}
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
                    <h3 className="text-sm font-bold text-white mb-1">Production Best Practices</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        For real-time multi-agent environments, it is recommended to use <strong>WebSockets</strong> for state updates.
                        The REST endpoint shown here is best for developer triggers or manual overrides from the teacher panel.
                        Check the <span className="text-indigo-400 hover:underline cursor-pointer">API Contract documentation</span> for full schema details.
                    </p>
                </div>
            </div>
        </div>
    );
};
