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
import type { Student, TeacherActionType, TeacherInputRequest, AIResponse } from '../../types';
import { apiClient } from '../../api/client';

const MOCK_STUDENTS: Student[] = [
    { id: '1', name: 'Güneş Aksoy', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gunes' },
    { id: '2', name: 'Deniz Yılmaz', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deniz' },
    { id: '3', name: 'Rüzgar Demir', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ruzgar' },
    { id: '4', name: 'Bulut Kaya', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bulut' },
];

const MOCK_ACTIVITIES = [
    {
        id: 1,
        studentName: 'Güneş Aksoy',
        action: 'soruyu doğru cevapladı',
        subject: 'Kuantum Fiziği',
        time: '2 DAKİKA ÖNCE',
        type: 'success',
        icon: <Award size={14} />
    },
    {
        id: 2,
        studentName: 'Rüzgar Demir',
        action: 'dikkati dağıldı',
        subject: 'Uuyarı Gönderildi',
        time: '5 DAKİKA ÖNCE',
        type: 'warning',
        icon: <AlertTriangle size={14} />
    },
    {
        id: 3,
        studentName: 'Deniz Yılmaz',
        action: 'parmak kaldırdı',
        subject: 'Soru Sormak İstiyor',
        time: '12 DAKİKA ÖNCE',
        type: 'info',
        icon: <MessageSquare size={14} />
    },
    {
        id: 4,
        studentName: 'Bulut Kaya',
        action: 'odaklanma seviyesi arttı',
        subject: 'Motivasyon',
        time: '15 DAKİKA ÖNCE',
        type: 'success',
        icon: <Zap size={14} />
    },
];

export const TeacherPanel: React.FC = () => {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [actionStatus, setActionStatus] = useState<string | null>(null);
    const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [individualMessage, setIndividualMessage] = useState('');


    const handleTeacherAction = async (action: TeacherActionType) => {
        if (!selectedStudentId) return;

        setIsActionLoading(true);
        setActionStatus(null);
        setLastResponse(null);

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
            setLastResponse(response);
            setActionStatus(`Success: ${response.reply_text}`);

            // Auto-hide status after 5 seconds
            setTimeout(() => setActionStatus(null), 5000);
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
                    <button
                        onClick={() => setShowVoiceModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 transition-all text-sm font-medium"
                    >
                        <Mic size={16} /> Start Voice Interaction
                    </button>
                    <button
                        onClick={() => setShowQuickActions(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-all text-sm font-bold shadow-lg shadow-indigo-900/20"
                    >
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
                            {MOCK_ACTIVITIES.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/30 transition-colors group">
                                    <div className={`mt-1.5 w-6 h-6 rounded-lg flex items-center justify-center ${activity.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                                            activity.type === 'warning' ? 'bg-red-500/10 text-red-400' :
                                                'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {activity.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-300">
                                            <span className="font-bold text-white">{activity.studentName}</span> {activity.action}
                                            <span className={`font-medium ml-1 ${activity.type === 'success' ? 'text-emerald-400' :
                                                    activity.type === 'warning' ? 'text-red-400' :
                                                        'text-indigo-400'
                                                }`}>{activity.subject}</span>.
                                        </p>
                                        <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest mt-1 block">{activity.time}</span>
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
                                    {/* Main Action Buttons - 2x3 Grid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => handleTeacherAction('praise')}
                                            disabled={isActionLoading}
                                            className="flex flex-col items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 hover:bg-emerald-500/20 transition-all group disabled:opacity-50"
                                        >
                                            <Award size={20} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Praise</span>
                                        </button>
                                        <button
                                            onClick={() => handleTeacherAction('warn')}
                                            disabled={isActionLoading}
                                            className="flex flex-col items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all group disabled:opacity-50"
                                        >
                                            <AlertTriangle size={20} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Warn</span>
                                        </button>
                                        <button
                                            onClick={() => handleTeacherAction('encourage')}
                                            disabled={isActionLoading}
                                            className="flex flex-col items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 hover:bg-amber-500/20 transition-all group disabled:opacity-50"
                                        >
                                            <Zap size={20} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Encourage</span>
                                        </button>
                                        <button
                                            onClick={() => handleTeacherAction('question')}
                                            disabled={isActionLoading}
                                            className="flex flex-col items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-all group disabled:opacity-50"
                                        >
                                            <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Question</span>
                                        </button>
                                        <button
                                            onClick={() => handleTeacherAction('command_sit')}
                                            disabled={isActionLoading}
                                            className="flex flex-col items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 hover:bg-purple-500/20 transition-all group disabled:opacity-50"
                                        >
                                            <Users size={20} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Sit</span>
                                        </button>
                                        <button
                                            onClick={() => handleTeacherAction('command_stand')}
                                            disabled={isActionLoading}
                                            className="flex flex-col items-center gap-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 hover:bg-cyan-500/20 transition-all group disabled:opacity-50"
                                        >
                                            <Users size={20} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold uppercase">Stand</span>
                                        </button>
                                    </div>

                                    {/* Custom Text Input */}
                                    <div className="space-y-2">
                                        <textarea
                                            id="customMessageInput"
                                            placeholder="Serbest mesaj veya soru yazın..."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none resize-none transition-all"
                                            rows={2}
                                            disabled={isActionLoading}
                                        />
                                        <button
                                            onClick={() => {
                                                const textarea = document.getElementById('customMessageInput') as HTMLTextAreaElement;
                                                const text = textarea?.value.trim();
                                                if (text && selectedStudentId) {
                                                    setIsActionLoading(true);
                                                    apiClient.sendTeacherAction({
                                                        source: "web",
                                                        teacher_id: "teacher_001",
                                                        student_id: selectedStudentId,
                                                        input_type: "text",
                                                        content: text,
                                                        teacher_action: "question"
                                                    }).then(response => {
                                                        setActionStatus(`AI: ${response.reply_text}`);
                                                        setLastResponse(response);
                                                        textarea.value = '';
                                                    }).catch(err => {
                                                        setActionStatus(`Error: ${err.message}`);
                                                    }).finally(() => {
                                                        setIsActionLoading(false);
                                                    });
                                                }
                                            }}
                                            disabled={isActionLoading}
                                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                        >
                                            {isActionLoading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                                        </button>
                                    </div>

                                    {/* Response Display */}
                                    {lastResponse && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold uppercase text-slate-500">AI Response</span>
                                                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded">
                                                    {lastResponse.emotion}
                                                </span>
                                            </div>
                                            <p className="text-white text-sm font-medium">{lastResponse.reply_text}</p>
                                            <div className="flex gap-2 text-[10px] text-slate-500">
                                                <span>Animation: {lastResponse.animation}</span>
                                                <span>•</span>
                                                <span>Confidence: {(lastResponse.confidence * 100).toFixed(0)}%</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {actionStatus && !lastResponse && (
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


                                    <button
                                        onClick={() => setShowMessageModal(true)}
                                        className="w-full flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white hover:bg-slate-700 transition-all"
                                    >
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

            {/* Quick Actions Modal */}
            <AnimatePresence>
                {showQuickActions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={() => setShowQuickActions(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-[400px] max-w-[90vw]"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Hızlı Aksiyon - Öğrenci Seç</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {MOCK_STUDENTS.map((student) => (
                                    <button
                                        key={student.id}
                                        onClick={async () => {
                                            setSelectedStudentId(student.id);
                                            setShowQuickActions(false);
                                            await handleTeacherAction('praise');
                                        }}
                                        className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
                                    >
                                        <img src={student.avatarUrl} className="w-8 h-8 rounded-lg" />
                                        <span className="text-sm text-white font-medium truncate">{student.name}</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowQuickActions(false)}
                                className="w-full mt-4 py-2 text-slate-400 hover:text-white transition-all"
                            >
                                İptal
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Voice Interaction Modal */}
            <AnimatePresence>
                {showVoiceModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={() => setShowVoiceModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-[400px] max-w-[90vw] text-center"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 bg-indigo-600/20 rounded-full flex items-center justify-center">
                                <Mic size={40} className="text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Sesli Etkileşim</h2>
                            <p className="text-slate-400 text-sm mb-6">
                                Sesli etkileşim özelliği yakında aktif olacak. Şimdilik metin girişini kullanabilirsiniz.
                            </p>
                            <button
                                onClick={() => setShowVoiceModal(false)}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all"
                            >
                                Tamam
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Individual Message Modal */}
            <AnimatePresence>
                {showMessageModal && selectedStudentId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={() => setShowMessageModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-[450px] max-w-[90vw]"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={MOCK_STUDENTS.find(s => s.id === selectedStudentId)?.avatarUrl}
                                    className="w-12 h-12 rounded-xl"
                                />
                                <div>
                                    <h2 className="text-lg font-bold text-white">
                                        {MOCK_STUDENTS.find(s => s.id === selectedStudentId)?.name}
                                    </h2>
                                    <span className="text-slate-500 text-sm">Özel mesaj gönder</span>
                                </div>
                            </div>
                            <textarea
                                value={individualMessage}
                                onChange={(e) => setIndividualMessage(e.target.value)}
                                placeholder="Mesajınızı yazın..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none resize-none"
                                rows={4}
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setShowMessageModal(false)}
                                    className="flex-1 py-2 text-slate-400 hover:text-white border border-slate-700 rounded-xl transition-all"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={async () => {
                                        if (individualMessage.trim()) {
                                            setIsActionLoading(true);
                                            try {
                                                const response = await apiClient.sendTeacherAction({
                                                    source: "web",
                                                    teacher_id: "teacher_001",
                                                    student_id: selectedStudentId,
                                                    input_type: "text",
                                                    content: individualMessage,
                                                    teacher_action: "question"
                                                });
                                                setLastResponse(response);
                                                setActionStatus(`AI: ${response.reply_text}`);
                                                setIndividualMessage('');
                                                setShowMessageModal(false);
                                            } catch (err: any) {
                                                setActionStatus(`Error: ${err.message}`);
                                            } finally {
                                                setIsActionLoading(false);
                                            }
                                        }
                                    }}
                                    disabled={isActionLoading || !individualMessage.trim()}
                                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                                >
                                    {isActionLoading ? 'Gönderiliyor...' : 'Gönder'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
