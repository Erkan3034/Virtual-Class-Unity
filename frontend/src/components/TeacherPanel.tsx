import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Bot,
    Sparkles,
    GraduationCap,
    Terminal,
    Code2,
    X,
    Copy,
    Check,
    MessageSquare,
    Activity
} from 'lucide-react';
import { apiClient } from '../api/client';
import type { AIResponse, Student } from '../types/index';

// --- Data ---
const DUMMY_STUDENTS: Student[] = [
    { id: 'student_001', name: 'Ahmet Yılmaz', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet' },
    { id: 'student_002', name: 'Ayşe Demir', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse' },
    { id: 'student_003', name: 'Can Kaya', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Can' },
];

// --- Components ---

const UnityModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [copied, setCopied] = useState(false);

    const unityScript = `using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
// ... (Full script available in unity_assets/AIClient.cs)`;

    const handleCopy = () => {
        navigator.clipboard.writeText(unityScript); // In real app, allow copying full file content or path
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto max-w-2xl h-fit bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <Terminal size={24} />
                                <h2 className="text-xl font-bold">Unity Integration Setup</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold">1</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Get the Script</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Locate the <code className="bg-indigo-100 px-1 py-0.5 rounded text-indigo-700">AIClient.cs</code> file in your project folder under <code className="text-gray-800">unity_assets/</code>.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold">2</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Attach to Character</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Add the script to your 3D character (Student) in Unity. make sure an <code className="bg-indigo-100 px-1 py-0.5 rounded text-indigo-700">Animator</code> component is attached.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold">3</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Configure URL</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Set the API URL to <code className="bg-gray-100 px-1 py-0.5 rounded select-all">http://localhost:8000/teacher-input</code> in the Inspector.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-xl p-4 relative overflow-hidden group">
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={handleCopy}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs"
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? 'Copied!' : 'Copy Snippet'}
                                    </button>
                                </div>
                                <code className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                                    {unityScript}
                                </code>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export const TeacherPanel: React.FC = () => {
    const [selectedStudent, setSelectedStudent] = useState<string>(DUMMY_STUDENTS[0].id);
    const [inputText, setInputText] = useState<string>('');
    const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isUnityModalOpen, setIsUnityModalOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.sendTeacherInput({
                teacher_id: 'teacher_curr',
                student_id: selectedStudent,
                input_type: 'text',
                content: inputText,
            });
            setLastResponse(response);
            setInputText('');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const currentStudent = DUMMY_STUDENTS.find(s => s.id === selectedStudent);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/50 p-6 md:p-12 font-sans text-slate-800">
            <UnityModal isOpen={isUnityModalOpen} onClose={() => setIsUnityModalOpen(false)} />

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-extrabold text-slate-900 tracking-tight"
                        >
                            Virtual Class <span className="text-indigo-600">AI</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 mt-2 text-lg"
                        >
                            Orchestrate your AI students in real-time
                        </motion.p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsUnityModalOpen(true)}
                        className="flex items-center gap-3 px-6 py-3 bg-white border border-indigo-100 text-indigo-600 rounded-xl shadow-sm hover:shadow-md font-semibold transition-all group"
                    >
                        <Code2 size={20} className="group-hover:rotate-12 transition-transform" />
                        Unity Integration
                    </motion.button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Panel: Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-5 space-y-6"
                    >
                        {/* Student Selector Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-100/50 border border-indigo-50/50 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <GraduationCap size={120} />
                            </div>

                            <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Select Student</label>

                            <div className="space-y-3 relative z-10">
                                {DUMMY_STUDENTS.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setSelectedStudent(s.id)}
                                        className={`w-full p-3 rounded-2xl flex items-center gap-4 transition-all duration-200 border ${selectedStudent === s.id
                                                ? 'bg-indigo-600 borderColor-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                : 'bg-slate-50 border-transparent hover:bg-white hover:border-indigo-100 text-slate-600'
                                            }`}
                                    >
                                        <img src={s.avatarUrl} alt={s.name} className="w-10 h-10 rounded-full bg-white/20" />
                                        <span className="font-bold">{s.name}</span>
                                        {selectedStudent === s.id && <Sparkles size={16} className="ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Card */}
                        <div className="bg-white rounded-3xl p-1 shadow-xl shadow-indigo-100/50 border border-indigo-50/50">
                            <form onSubmit={handleSubmit} className="p-5">
                                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Instruction</label>
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Enter your command here..."
                                    className="w-full bg-slate-50 rounded-xl p-4 text-slate-700 min-h-[160px] resize-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400 mb-4"
                                />

                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                        {inputText.length} chars
                                    </span>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !inputText.trim()}
                                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all transform ${isLoading
                                                ? 'bg-slate-300 cursor-not-allowed'
                                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Send <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                            {error && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="px-6 pb-6"
                                >
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center gap-2">
                                        <Activity size={16} /> {error}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Panel: Response */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-7 flex flex-col"
                    >
                        <div className="flex-1 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative flex flex-col min-h-[500px]">
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                            <div className="p-8 flex-1 flex flex-col justify-center items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                                <AnimatePresence mode="wait">
                                    {lastResponse ? (
                                        <motion.div
                                            key={lastResponse.reply_text + Date.now()}
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="w-full max-w-lg"
                                        >
                                            {/* Chat Bubble */}
                                            <div className="bg-white p-8 rounded-[2rem] rounded-bl-sm shadow-xl border border-slate-100 relative mb-8">
                                                <div className="absolute -left-3 bottom-0 w-6 h-6 bg-white transform skew-x-[20deg] border-l border-b border-slate-100 shadow-sm" />
                                                <p className="text-2xl font-medium text-slate-800 leading-relaxed text-center">
                                                    "{lastResponse.reply_text}"
                                                </p>
                                            </div>

                                            {/* Student Status */}
                                            <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
                                                <div className="relative">
                                                    <img
                                                        src={currentStudent?.avatarUrl}
                                                        alt="Avatar"
                                                        className="w-20 h-20 rounded-2xl bg-indigo-50 shadow-inner"
                                                    />
                                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
                                                </div>

                                                <div className="space-y-2 flex-1">
                                                    <h3 className="text-xl font-bold text-slate-900">{currentStudent?.name}</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wide">
                                                            {lastResponse.emotion}
                                                        </span>
                                                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-lg text-xs font-bold uppercase tracking-wide">
                                                            {lastResponse.animation}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-center px-4 border-l border-slate-200">
                                                    <div className="text-3xl font-black text-slate-200">
                                                        {(lastResponse.confidence * 100).toFixed(0)}<span className="text-sm text-slate-300">%</span>
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center text-slate-400"
                                        >
                                            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                                <Bot size={48} className="text-slate-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-300">No interaction yet</h3>
                                            <p className="max-w-xs mx-auto mt-2 text-sm text-slate-300">Select a student and send a command to start the session.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer / Debug Info */}
                            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-mono">
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1">
                                        <MessageSquare size={12} /> {selectedStudent}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Terminal size={12} /> NLP v1.0
                                    </span>
                                </div>
                                <div>
                                    {lastResponse && `Intent: ${lastResponse.meta?.intent_detected || 'N/A'}`}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

