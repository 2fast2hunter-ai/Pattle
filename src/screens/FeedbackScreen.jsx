import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Send, CheckCircle, Clock, Bug, Lightbulb, Scale, MessageCircle, RefreshCw, List, Eye } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';

const WEBHOOK_URL = 'http://paperclip-afsc.srv1732766.hstgr.cloud/api/routine-triggers/public/d9fc457e876a4e9e10e58669/fire';
const WEBHOOK_TOKEN = '3713487365075ac01dacecf4bf11e51067280bdc958081ff';
const APP_VERSION = '1.0.0';

async function fireWebhook({ category, message, userId }) {
    const platform = Capacitor.getPlatform() === 'android' ? 'android' : 'web';
    const title = message.length > 60 ? message.slice(0, 57) + '...' : message;
    await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify({
            type: category,
            title,
            body: message,
            player_id: userId,
            platform,
            version: APP_VERSION,
        }),
    });
}

const CATEGORIES = [
    { id: 'bug', key: 'feedback_cat_bug', fallback: '🐛 Bug Report' },
    { id: 'suggestion', key: 'feedback_cat_suggestion', fallback: '💡 Suggestion' },
    { id: 'balance', key: 'feedback_cat_balance', fallback: '⚖️ Balance Feedback' },
    { id: 'other', key: 'feedback_cat_other', fallback: '💬 Other' },
];

const CATEGORY_ICONS = {
    bug: { icon: Bug, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    suggestion: { icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    balance: { icon: Scale, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    other: { icon: MessageCircle, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
};

const STATUS_CONFIG = {
    new: { label: 'New', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: Clock },
    reviewed: { label: 'In Review', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Eye },
    done: { label: 'Done', color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: CheckCircle },
};

function FeedbackListItem({ item, t }) {
    const cfg = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.other;
    const Icon = cfg.icon;
    const statusKey = item.status || 'new';
    const statusCfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.new;
    const StatusIcon = statusCfg.icon;
    const date = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt || 0);
    const statusLabel = t ? t(`feedback_status_${statusKey}`) : statusCfg.label;
    return (
        <div className={`rounded-2xl border p-4 space-y-2 ${cfg.bg}`}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                    <span className={`text-xs font-bold uppercase ${cfg.color}`}>{item.category}</span>
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusLabel}
                </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{item.message}</p>
            <div className="flex items-center justify-between text-xs text-slate-600">
                <span>{item.userName}</span>
                <span>{date.toLocaleDateString()}</span>
            </div>
        </div>
    );
}

export default function FeedbackScreen({ onBack, user, t }) {
    const [tab, setTab] = useState('submit');

    // Submit tab state
    const [category, setCategory] = useState('bug');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    // List tab state
    const [feedbackList, setFeedbackList] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [listError, setListError] = useState(null);

    const handleSubmit = async () => {
        if (!message.trim() || submitting) return;
        setSubmitting(true);
        setError(null);
        try {
            const trimmedMessage = message.trim();
            const userId = user?.id || user?.uid || 'anonymous';
            const userName = user?.displayName || user?.username || 'Anonymous';
            await addDoc(collection(db, 'feedback'), {
                category,
                message: trimmedMessage,
                userId,
                userName,
                status: 'new',
                createdAt: serverTimestamp(),
            });
            fireWebhook({ category, message: trimmedMessage, userId }).catch(err =>
                console.error('Feedback webhook error:', err)
            );
            setSubmitted(true);
        } catch (err) {
            console.error('Feedback error:', err);
            setError(t ? t('feedback_send_error') : 'Error sending. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const loadFeedback = async () => {
        setListLoading(true);
        setListError(null);
        try {
            const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), limit(100));
            const snap = await getDocs(q);
            setFeedbackList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error('Feedback list error:', err);
            setListError(t ? t('feedback_list_error') : 'Could not load feedback.');
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 'list') loadFeedback();
    }, [tab]);

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
                {tab === 'list' && (
                    <button
                        onClick={loadFeedback}
                        className="absolute right-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                    >
                        <RefreshCw className={`w-5 h-5 ${listLoading ? 'animate-spin' : ''}`} />
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 shrink-0">
                <button
                    onClick={() => setTab('submit')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                        tab === 'submit'
                            ? 'text-indigo-400 border-b-2 border-indigo-500'
                            : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                    <Send className="w-3.5 h-3.5" />
                    {t ? t('feedback_tab_submit') : 'Submit'}
                </button>
                <button
                    onClick={() => setTab('list')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                        tab === 'list'
                            ? 'text-indigo-400 border-b-2 border-indigo-500'
                            : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                    <List className="w-3.5 h-3.5" />
                    {t ? t('feedback_tab_list') : 'Community'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {tab === 'submit' ? (
                    <>
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                                <CheckCircle className="w-16 h-16 text-green-400" />
                                <h3 className="text-xl font-black text-white">
                                    {t ? t('feedback_success_title') : 'Thanks for your feedback!'}
                                </h3>
                                <p className="text-slate-400 text-sm max-w-xs">
                                    {t ? t('feedback_success_desc') : 'Your feedback was submitted successfully and will be reviewed.'}
                                </p>
                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => { setSubmitted(false); setMessage(''); }}
                                        className="px-5 py-3 rounded-2xl bg-slate-800 text-white font-black text-sm hover:bg-slate-700 transition-colors border border-white/5"
                                    >
                                        {t ? t('feedback_submit_another') : 'Send More'}
                                    </button>
                                    <button
                                        onClick={() => setTab('list')}
                                        className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-500 transition-colors"
                                    >
                                        {t ? t('feedback_view_all') : 'View All'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <p className="text-slate-400 text-sm">
                                    {t ? t('feedback_desc') : 'Help us improve Pattle! Your feedback goes directly to our team.'}
                                </p>

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
                    </>
                ) : (
                    <div className="space-y-3">
                        <p className="text-xs text-slate-500 px-1">
                            {t ? t('feedback_community_desc') : 'Feedback from the community — see what others have reported and its current status.'}
                        </p>
                        {listLoading ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-500">
                                <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                                <span className="text-xs font-bold uppercase tracking-wider">Loading...</span>
                            </div>
                        ) : listError ? (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {listError}
                            </div>
                        ) : feedbackList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-600">
                                <MessageSquare className="w-8 h-8" />
                                <span className="text-xs font-bold uppercase tracking-wider">No feedback yet</span>
                            </div>
                        ) : (
                            feedbackList.map(item => (
                                <FeedbackListItem key={item.id} item={item} t={t} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
