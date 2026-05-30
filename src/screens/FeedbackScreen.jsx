import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CATEGORIES = [
    { id: 'bug', key: 'feedback_cat_bug', fallback: '🐛 Bug Report' },
    { id: 'suggestion', key: 'feedback_cat_suggestion', fallback: '💡 Suggestion' },
    { id: 'balance', key: 'feedback_cat_balance', fallback: '⚖️ Balance Feedback' },
    { id: 'other', key: 'feedback_cat_other', fallback: '💬 Other' },
];

export default function FeedbackScreen({ onBack, user, t }) {
    const [category, setCategory] = useState('bug');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (!message.trim() || submitting) return;
        setSubmitting(true);
        setError(null);
        try {
            await addDoc(collection(db, 'feedback'), {
                category,
                message: message.trim(),
                userId: user?.id || user?.uid || 'anonymous',
                userName: user?.displayName || user?.username || 'Unbekannt',
                status: 'new',
                createdAt: serverTimestamp(),
            });
            setSubmitted(true);
        } catch (err) {
            console.error('Feedback error:', err);
            setError(t ? t('feedback_send_error') : 'Error sending. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 animate-in fade-in slide-in-from-right duration-300">
            <div className="relative flex items-center justify-center p-4 shrink-0 border-b border-white/5">
                <button
                    onClick={onBack}
                    className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-pink-400" />
                    <h2 className="text-xl font-black italic tracking-wide text-white">
                        {t ? t('feedback_title') : 'FEEDBACK'}
                    </h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {submitted ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <CheckCircle className="w-16 h-16 text-green-400" />
                        <h3 className="text-xl font-black text-white">
                            {t ? t('feedback_success_title') : 'Thanks for your feedback!'}
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xs">
                            {t ? t('feedback_success_desc') : 'Your feedback was submitted successfully and will be reviewed.'}
                        </p>
                        <button
                            onClick={onBack}
                            className="mt-4 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-500 transition-colors"
                        >
                            {t ? t('feedback_back') : 'BACK'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <p className="text-slate-400 text-sm">
                            {t ? t('feedback_desc') : 'Help us improve Pattle! Your feedback goes directly to our team.'}
                        </p>

                        {/* Kategorie */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                                {t ? t('feedback_category') : 'Kategorie'}
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`p-3 rounded-2xl border text-sm font-bold transition-all active:scale-[0.98] text-left ${
                                            category === cat.id
                                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                                : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                    >
                                        {t ? t(cat.key) : cat.fallback}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Nachricht */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                                {t ? t('feedback_message') : 'Nachricht'}
                            </h3>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t ? t('feedback_placeholder') : 'Beschreibe deinen Bug oder Vorschlag...'}
                                maxLength={500}
                                rows={5}
                                className="w-full bg-slate-900 border border-white/5 rounded-2xl p-4 text-white text-sm resize-none focus:outline-none focus:border-indigo-500/50 placeholder-slate-600"
                            />
                            <div className="text-right text-xs text-slate-600">{message.length}/500</div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={!message.trim() || submitting}
                            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase tracking-wider hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                            {submitting
                                ? (t ? t('feedback_sending') : 'Senden...')
                                : (t ? t('feedback_submit') : 'FEEDBACK SENDEN')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
