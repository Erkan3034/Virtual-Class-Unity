import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Terminal,
    Code2,
    Cpu,
    Eye,
    Play,
    Database,
    Server,
    Zap,
    AlertCircle
} from 'lucide-react';
import { apiClient } from '../../api/client';
import type {
    TeacherInputRequest,
    AIResponse,
    TeacherActionType,
    Student,
    InputSourceType
} from '../../types/index';

// --- Simulation Data ---
const SIMULATION_STUDENTS: Student[] = [
    { id: 'student_001', name: 'Ahmet Yılmaz', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet' },
    { id: 'student_002', name: 'Ayşe Demir', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse' },
];

const ACTIONS: TeacherActionType[] = ["praise", "warn", "encourage", "question", "command_sit", "command_stand", "ignore"];

export const DebugDashboard: React.FC = () => {
    // --- State ---
    const [selectedStudent, setSelectedStudent] = useState<string>(SIMULATION_STUDENTS[0].id);
    const [manualAction, setManualAction] = useState<TeacherActionType | 'custom'>('praise');
    const [customText, setCustomText] = useState('');
    const [source, setSource] = useState<InputSourceType>('web');

    const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Handlers ---
    const handleSimulate = async () => {
        setIsLoading(true);
        setError(null);

        const payload: TeacherInputRequest = {
            source: source,
            teacher_id: "debug_user",
            student_id: selectedStudent,
            input_type: "text",
            content: manualAction === 'custom' ? customText : `[ACTION: ${manualAction}]`,
            teacher_action: manualAction === 'custom' ? undefined : manualAction
        };

        try {
            const response = await apiClient.sendTeacherAction(payload);
            setLastResponse(response);
        } catch (err: any) {
            setError(err.message || "Simulation Failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-mono text-sm">
            {/* Top Bar */}
            <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <Cpu className="text-indigo-400" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-100 tracking-tight">AI Decision Engine</h1>
                        <p className="text-slate-500 text-xs uppercase tracking-widest">Debug & Observation Console</p>
                    </div>
                </div>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-2 text-green-400 bg-green-900/20 px-3 py-1.5 rounded-full border border-green-900/30">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        SYSTEM ONLINE
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6">

                {/* --- LEFT: SIMULATOR --- */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center gap-2">
                            <Play size={16} className="text-indigo-400" />
                            <h2 className="font-bold text-slate-300">Input Simulator</h2>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* Source Toggle */}
                            <div className="flex bg-slate-800 rounded-lg p-1">
                                <button
                                    onClick={() => setSource('web')}
                                    className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all ${source === 'web' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    WEB (Debug)
                                </button>
                                <button
                                    onClick={() => setSource('unity')}
                                    className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all ${source === 'unity' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    UNITY (Mock)
                                </button>
                            </div>

                            {/* Target Student */}
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 font-bold uppercase">Target Student (Agent)</label>
                                <select
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg p-2.5 focus:border-indigo-500 outline-none"
                                >
                                    {SIMULATION_STUDENTS.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Action Type */}
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 font-bold uppercase">Inject Teacher Action</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ACTIONS.map(action => (
                                        <button
                                            key={action}
                                            onClick={() => setManualAction(action)}
                                            className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left ${manualAction === action
                                                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                                                : 'bg-slate-800/50 border-transparent hover:bg-slate-800 text-slate-400'
                                                }`}
                                        >
                                            {action}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setManualAction('custom')}
                                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left ${manualAction === 'custom'
                                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                            : 'bg-slate-800/50 border-transparent hover:bg-slate-800 text-slate-400'
                                            }`}
                                    >
                                        [CUSTOM TEXT]
                                    </button>
                                </div>
                            </div>

                            {manualAction === 'custom' && (
                                <textarea
                                    value={customText}
                                    onChange={(e) => setCustomText(e.target.value)}
                                    placeholder="Type raw text to test NLP..."
                                    className="w-full h-20 bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-300 focus:border-amber-500 outline-none resize-none"
                                />
                            )}

                            <button
                                onClick={handleSimulate}
                                disabled={isLoading}
                                className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${isLoading
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40 hover:scale-[1.02]'
                                    }`}
                            >
                                {isLoading ? (
                                    <Activity size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        <Zap size={18} /> INJECT PAYLOAD
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs flex items-center gap-2">
                                    <AlertCircle size={14} /> {error}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* --- RIGHT: INSPECTOR --- */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

                    {/* Visualizer Card */}
                    <div className="grid grid-cols-2 gap-6">
                        <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Database size={80} />
                            </div>
                            <h3 className="text-slate-500 font-bold uppercase text-xs mb-4 flex items-center gap-2">
                                <Server size={14} /> Student State (After)
                            </h3>
                            {lastResponse ? (
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${lastResponse.student_state === 'attentive' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                                            lastResponse.student_state === 'sleepy' ? 'bg-blue-400' :
                                                'bg-yellow-500'
                                            }`} />
                                        <span className="text-2xl font-bold text-white tracking-tight capitalize">
                                            {lastResponse.student_state}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                            <span className="text-slate-500 block">Mood</span>
                                            <span className="text-indigo-400 font-medium">{lastResponse.decision_trace.state_after.mood}</span>
                                        </div>
                                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                            <span className="text-slate-500 block">Attention</span>
                                            <span className="text-emerald-400 font-medium">
                                                {(lastResponse.decision_trace.state_after.attention_level * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-slate-600 text-center py-8">No Data</div>
                            )}
                        </section>

                        <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                            <h3 className="text-slate-500 font-bold uppercase text-xs mb-4 flex items-center gap-2">
                                <Eye size={14} /> Unity Output
                            </h3>
                            {lastResponse ? (
                                <div className="space-y-4">
                                    <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/30">
                                        <div className="text-[10px] text-indigo-400 mb-1">ANIMATION TRIGGER</div>
                                        <div className="font-mono text-lg text-white font-bold">{lastResponse.animation}</div>
                                    </div>
                                    <div className="bg-black/30 p-3 rounded-lg border border-slate-700">
                                        <div className="text-[10px] text-slate-400 mb-1">REPLY TEXT</div>
                                        <div className="font-sans text-slate-300 italic">"{lastResponse.reply_text}"</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-slate-600 text-center py-8">No Data</div>
                            )}
                        </section>
                    </div>

                    {/* Trace Log (Terminal) */}
                    <section className="flex-1 bg-black border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[300px]">
                        <div className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
                                <Terminal size={14} />
                                <span>DECISION TRACE LOG</span>
                            </div>
                            {lastResponse && (
                                <span className="text-[10px] text-slate-600 font-mono">
                                    {lastResponse.meta.timestamp}
                                </span>
                            )}
                        </div>
                        <div className="p-4 font-mono text-xs overflow-auto flex-1 custom-scrollbar">
                            {lastResponse ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-1"
                                >
                                    <div className="text-slate-500 border-l-2 border-slate-800 pl-3 mb-4">
                                        <div className="flex gap-2">
                                            <span className="text-blue-500 font-bold">REQ</span>
                                            <span className="text-slate-300">[{source.toUpperCase()}] {manualAction === 'custom' ? customText : manualAction}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="text-pink-500 font-bold mb-1">NLP ANALYSIS</div>
                                            <pre className="text-pink-300/80">Intent: {lastResponse.decision_trace.intent}</pre>
                                            <pre className="text-pink-300/80">Confidence: {lastResponse.confidence}</pre>
                                        </div>
                                        <div>
                                            <div className="text-amber-500 font-bold mb-1">LOGIC ENGINE</div>
                                            <pre className="text-amber-300/80">Rule: {lastResponse.decision_trace.rule_applied}</pre>
                                            <pre className="text-amber-300/80">StatePrev: {lastResponse.decision_trace.state_before.mood}</pre>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-800 pt-3">
                                        <div className="text-slate-500 mb-2">RAW JSON TRACE</div>
                                        <pre className="text-green-400/90 whitespace-pre-wrap break-all bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                            {JSON.stringify(lastResponse, null, 2)}
                                        </pre>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-2">
                                    <Code2 size={40} />
                                    <p>Waiting for input stream...</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
