import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    MessageSquare,
    Settings,
    BarChart3,
    Award,
    AlertTriangle,
    Zap,
    Mic,
    MoreVertical,
    ChevronRight,
} from 'lucide-react';
import type { Student, TeacherActionType, TeacherInputRequest } from '../../types';
import { apiClient } from '../../api/client';

const MOCK_STUDENTS: Student[] = [
    { id: '1', name: 'Güneş Aksoy', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gunes' },
    { id: '2', name: 'Deniz Yılmaz', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deniz' },
    { id: '3', name: 'Rüzgar Demir', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ruzgar' },
    { id: '4', name: 'Bulut Kaya', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bulut' },
];

export const TeacherPanel: React.FC = () => {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [actionStatus, setActionStatus] = useState<string | null>(null);

    const handleTeacherAction = async (action: TeacherActionType) => {
        if (!selectedStudentId) return;

        setIsActionLoading(true);
        setActionStatus(null);

        const payload: TeacherInputRequest = {
            source: "web",
            teacher_id: "teacher_001", // Mock teacher ID
            student_id: selectedStudentId,
            input_type: "text",
            content: `Teacher triggered ${action}`,
            teacher_action: action
        };

        try {
            const response = await apiClient.sendTeacherAction(payload);
            setActionStatus(`Successfully sent: ${response.reply_text}`);

            // Auto-hide status after 3 seconds
            setTimeout(() => setActionStatus(null), 3000);
        } catch (error: any) {
            console.error("Action failed:", error);
            setActionStatus(`Error: ${error.message}`);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Live Classroom</h1>
                    <p className="text-slate-500 mt-1">Real-time interaction and student management</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 transition-all text-sm font-medium">
                        <Mic size={16} /> Start Voice Interaction
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-all text-sm font-bold shadow-lg shadow-indigo-900/20">
                        <Zap size={16} /> Quick Action
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Student List */}
                <div className="col-span-12 xl:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MOCK_STUDENTS.map((student) => (
                            <motion.div
                                key={student.id}
                                whileHover={{ y: -4 }}
                                onClick={() => setSelectedStudentId(student.id)}
                                className={`group p-4 rounded-2xl border transition-all cursor-pointer ${selectedStudentId === student.id
                                    ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-900/20'
                                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={student.avatarUrl} alt={student.name} className="w-14 h-14 rounded-xl bg-slate-800 border-2 border-slate-700 p-1" />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white">{student.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                                                Attentive
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500">
                                                98% Engaged
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Activity Feed / Stats */}
                    <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-white flex items-center gap-2">
                                <BarChart3 size={18} className="text-indigo-400" /> Recent Classroom Activity
                            </h2>
                            <button className="text-sm text-indigo-400 font-medium hover:underline flex items-center gap-1">
                                View All <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/30 transition-colors group">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500" />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-300">
                                            <span className="font-bold text-white">Güneş Aksoy</span> answered a question correctly about
                                            <span className="text-indigo-400 font-medium ml-1">Quantum Physics</span>.
                                        </p>
                                        <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest mt-1 block">2 MINS AGO</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Action Sidebar */}
                <div className="col-span-12 xl:col-span-4 space-y-6">
                    <AnimatePresence mode="wait">
                        {selectedStudentId ? (
                            <motion.div
                                key="action-panel"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sticky top-8"
                            >
                                <div className="flex flex-col items-center text-center mb-8">
                                    <img
                                        src={MOCK_STUDENTS.find(s => s.id === selectedStudentId)?.avatarUrl}
                                        className="w-24 h-24 rounded-3xl bg-slate-800 border-4 border-slate-800 p-2 mb-4"
                                    />
                                    <h3 className="text-xl font-bold text-white">{MOCK_STUDENTS.find(s => s.id === selectedStudentId)?.name}</h3>
                                    <span className="text-slate-500 text-sm">Classroom ID: #{selectedStudentId.padStart(4, '0')}</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleTeacherAction('praise')}
                                            disabled={isActionLoading}
                                            className="flex flex-col items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 hover:bg-emerald-500/20 transition-all group disabled:opacity-50"
                                        >
                                            <Award size={24} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                {isActionLoading ? 'Sending...' : 'Praise'}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleTeacherAction('warn')}
                                            disabled={isActionLoading}
                                            className="flex flex-col items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 hover:bg-red-500/20 transition-all group disabled:opacity-50"
                                        >
                                            <AlertTriangle size={24} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                {isActionLoading ? 'Sending...' : 'Warn'}
                                            </span>
                                        </button>
                                    </div>

                                    {actionStatus && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`text-center p-2 rounded-lg text-[10px] font-bold uppercase tracking-widest ${actionStatus.startsWith('Error')
                                                ? 'bg-red-900/40 text-red-400 border border-red-900/50'
                                                : 'bg-emerald-900/40 text-emerald-400 border border-emerald-900/50'
                                                }`}
                                        >
                                            {actionStatus}
                                        </motion.div>
                                    )}

                                    <button className="w-full flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white hover:bg-slate-700 transition-all">
                                        <div className="flex items-center gap-3">
                                            <MessageSquare size={18} className="text-indigo-400" />
                                            <span className="text-sm font-medium">Send Individual Message</span>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-500" />
                                    </button>

                                    <div className="pt-6 border-t border-slate-800">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Student Traits</span>
                                            <Settings size={14} className="text-slate-600" />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase">Curious</span>
                                            <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase">Kinesthetic</span>
                                            <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase">High Energy</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
                                <Users size={48} className="text-slate-800 mb-4" />
                                <h3 className="text-slate-500 font-medium">Select a student to perform classroom actions</h3>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
