import React, { useEffect, useState } from 'react';
import { ArrowLeft, BarChart2, Users, Swords, TrendingUp, Shield, RefreshCw, Lock, MessageSquare, CheckCircle, Clock, Bug, Lightbulb, Scale, MessageCircle, Eye } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, limit, getDocs, updateDoc, doc, where } from 'firebase/firestore';
import { getAdminAnalytics } from '../utils/db';
import { RANK_TIERS } from '../utils/rankUtils';

const ADMIN_EMAILS = ['2fast2hunter@gmail.com'];

const RANK_COLORS = {
    Stone: 'bg-slate-500',
    Bronze: 'bg-amber-700',
    Silver: 'bg-slate-300',
    Gold: 'bg-yellow-400',
    Platinum: 'bg-cyan-400',
    Diamond: 'bg-blue-400',
    Master: 'bg-purple-400',
};

function StatCard({ icon: Icon, label, value, sub, color = 'indigo' }) {
    const colorMap = {
        indigo: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/20',
        green: 'bg-green-600/20 text-green-400 border-green-500/20',
        pink: 'bg-pink-600/20 text-pink-400 border-pink-500/20',
        amber: 'bg-amber-600/20 text-amber-400 border-amber-500/20',
    };
    return (
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${colorMap[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider truncate">{label}</div>
                <div className="text-2xl font-black text-white">{value}</div>
                {sub && <div className="text-xs text-slate-500">{sub}</div>}
            </div>
        </div>
    );
}

function BarChart({ data, maxValue, colorClass = 'bg-indigo-500' }) {
    return (
        <div className="space-y-2">
            {data.map(({ label, value }) => {
                const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
                return (
                    <div key={label} className="flex items-center gap-3">
                        <div className="w-20 text-xs text-slate-400 font-bold truncate text-right shrink-0">{label}</div>
                        <div className="flex-1 bg-slate-800 rounded-full h-5 relative overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${colorClass}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <div className="w-8 text-xs text-slate-300 font-black text-right shrink-0">{value}</div>
                    </div>
                );
            })}
        </div>
    );
}

function RetentionFunnel({ retention, totalUsers }) {
    const steps = [
        { label: 'D1+', key: 'day1' },
        { label: 'D3+', key: 'day3' },
        { label: 'W1+', key: 'week1' },
        { label: 'W2+', key: 'week2' },
        { label: 'M1+', key: 'month1' },
    ];
    const base = retention.day1 || 1;
    return (
        <div className="space-y-2">
            {steps.map(({ label, key }) => {
                const val = retention[key] || 0;
                const pct = base > 0 ? Math.round((val / base) * 100) : 0;
                return (
                    <div key={key} className="flex items-center gap-3">
                        <div className="w-10 text-xs text-slate-400 font-bold text-right shrink-0">{label}</div>
                        <div className="flex-1 bg-slate-800 rounded-full h-5 relative overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <div className="w-16 text-xs text-slate-300 font-black text-right shrink-0">
                            {val} <span className="text-slate-500">({pct}%)</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

const CATEGORY_ICONS = {
    bug: { icon: Bug, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    suggestion: { icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    balance: { icon: Scale, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    other: { icon: MessageCircle, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
};

const STATUS_BADGES = {
    new: { label: 'New', color: 'text-yellow-400', Icon: Clock },
    reviewed: { label: 'In Review', color: 'text-blue-400', Icon: Eye },
    done: { label: 'Done', color: 'text-green-400', Icon: CheckCircle },
};

function FeedbackItem({ item, onSetStatus }) {
    const cfg = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.other;
    const Icon = cfg.icon;
    const date = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt || 0);
    const status = item.status || 'new';
    const badge = STATUS_BADGES[status] || STATUS_BADGES.new;
    return (
        <div className={`rounded-2xl border p-4 space-y-2 ${status === 'done' ? 'opacity-50' : ''} ${cfg.bg}`}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                    <span className={`text-xs font-bold uppercase ${cfg.color}`}>{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{item.userName}</span>
                    <span className={`flex items-center gap-1 text-xs font-bold ${badge.color}`}>
                        <badge.Icon className="w-3 h-3" /> {badge.label}
                    </span>
                </div>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{item.message}</p>
            <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">{date.toLocaleString()}</p>
                <div className="flex items-center gap-2">
                    {status !== 'reviewed' && status !== 'done' && (
                        <button
                            onClick={() => onSetStatus(item.id, 'reviewed')}
                            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors"
                        >
                            <Eye className="w-3 h-3" /> In Review
                        </button>
                    )}
                    {status !== 'done' && (
                        <button
                            onClick={() => onSetStatus(item.id, 'done')}
                            className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 font-bold transition-colors"
                        >
                            <CheckCircle className="w-3 h-3" /> Done
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardScreen({ onBack }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [feedback, setFeedback] = useState([]);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackFilter, setFeedbackFilter] = useState('new');
    const [feedbackError, setFeedbackError] = useState(null);

    const checkAdmin = () => {
        const email = auth.currentUser?.email;
        return email && ADMIN_EMAILS.includes(email);
    };

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAdminAnalytics();
            setData(result);
        } catch (e) {
            setError(e.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const loadFeedback = async () => {
        setFeedbackLoading(true);
        try {
            const q = feedbackFilter === 'all'
                ? query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), limit(50))
                : query(collection(db, 'feedback'), where('status', '==', feedbackFilter), orderBy('createdAt', 'desc'), limit(50));
            const snap = await getDocs(q);
            setFeedback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
            console.error('Feedback load error:', e);
        } finally {
            setFeedbackLoading(false);
        }
    };

    const setFeedbackStatus = async (id, status) => {
        setFeedbackError(null);
        try {
            await updateDoc(doc(db, 'feedback', id), { status });
            setFeedback(prev => prev.map(f => f.id === id ? { ...f, status } : f));
        } catch (e) {
            console.error('Feedback status update error:', e);
            setFeedbackError('Status update failed. Check Firestore rules and admin email.');
        }
    };

    useEffect(() => {
        const admin = checkAdmin();
        setIsAdmin(admin);
        if (admin) { loadData(); loadFeedback(); }
        else setLoading(false);
    }, []);

    useEffect(() => {
        if (isAdmin) loadFeedback();
    }, [feedbackFilter]);

    if (!isAdmin) {
        return (
            <div className="h-full flex flex-col bg-slate-950">
                <div className="relative flex items-center justify-center p-4 shrink-0 border-b border-white/5">
                    <button onClick={onBack} className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-black italic tracking-wide text-white">ADMIN</h2>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-500">
                    <Lock className="w-16 h-16 text-slate-700" />
                    <p className="font-bold text-sm">Access Denied</p>
                </div>
            </div>
        );
    }

    const rankData = data ? RANK_TIERS.map(t => ({ label: t.name, value: data.rankDist[t.name] || 0 })).reverse() : [];
    const maxRank = rankData.length ? Math.max(...rankData.map(r => r.value), 1) : 1;
    const maxPetCount = data?.topPets?.length ? Math.max(...data.topPets.map(p => p.count), 1) : 1;

    return (
        <div className="h-full flex flex-col bg-slate-950 animate-in fade-in slide-in-from-right duration-300">
            <div className="relative flex items-center justify-center p-4 shrink-0 border-b border-white/5">
                <button onClick={onBack} className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black italic tracking-wide text-white flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-400" /> ADMIN ANALYTICS
                </h2>
                <button onClick={loadData} className="absolute right-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5" title="Refresh">
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-10">
                {loading && !data && (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
                        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Loading analytics...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm font-bold">
                        Error: {error}
                    </div>
                )}

                {data && (
                    <>
                        {/* DAU / MAU */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Users className="w-4 h-4" /> Active Users
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <StatCard icon={Users} label="DAU" value={data.dau} sub="logged in today" color="indigo" />
                                <StatCard icon={TrendingUp} label="MAU" value={data.mau} sub="this month" color="green" />
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <StatCard icon={Users} label="Total Users" value={data.totalUsers} color="pink" />
                            </div>
                            {data.totalUsers > 0 && (
                                <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-500">
                                        <span>DAU/MAU Ratio</span>
                                        <span className="text-white">{data.mau > 0 ? Math.round((data.dau / data.mau) * 100) : 0}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-3">
                                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${data.mau > 0 ? Math.min(100, Math.round((data.dau / data.mau) * 100)) : 0}%` }} />
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Battles */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Swords className="w-4 h-4" /> Battle Stats (Top 200 Players)
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <StatCard icon={Swords} label="Total Battles" value={data.totalBattles.toLocaleString()} color="amber" />
                                <StatCard icon={TrendingUp} label="Total Wins" value={data.totalWins.toLocaleString()} sub={data.totalBattles > 0 ? `${Math.round((data.totalWins / data.totalBattles) * 100)}% win rate` : ''} color="green" />
                            </div>
                        </section>

                        {/* Top Pets */}
                        {data.topPets.length > 0 && (
                            <section className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Top Pets Used
                                </h3>
                                <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                                    <BarChart
                                        data={data.topPets.map(p => ({ label: p.species, value: p.count }))}
                                        maxValue={maxPetCount}
                                        colorClass="bg-indigo-500"
                                    />
                                </div>
                            </section>
                        )}

                        {/* Retention Funnel */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> Retention Funnel (by streak)
                            </h3>
                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                                <RetentionFunnel retention={data.retention} totalUsers={data.totalUsers} />
                            </div>
                            <p className="text-xs text-slate-600 px-1">D1+ = streak ≥ 1 day, W1+ = ≥ 7 days, M1+ = ≥ 30 days</p>
                        </section>

                        {/* Arena Rank Distribution */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Arena Rank Distribution (Top 200)
                            </h3>
                            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                                <BarChart
                                    data={rankData}
                                    maxValue={maxRank}
                                    colorClass="bg-purple-500"
                                />
                            </div>
                        </section>
                    </>
                )}

                {/* Feedback Review */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Player Feedback
                    </h3>
                    <div className="flex gap-2">
                        {['new', 'reviewed', 'done', 'all'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFeedbackFilter(f)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-colors ${feedbackFilter === f ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                        <button
                            onClick={loadFeedback}
                            className="ml-auto p-1.5 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${feedbackLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    {feedbackError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                            {feedbackError}
                        </div>
                    )}
                    {feedbackLoading ? (
                        <div className="flex items-center justify-center h-20 text-slate-500 gap-2 text-xs font-bold">
                            <RefreshCw className="w-4 h-4 animate-spin" /> Loading feedback...
                        </div>
                    ) : feedback.length === 0 ? (
                        <div className="flex items-center justify-center h-20 text-slate-600 gap-2 text-xs font-bold">
                            <Clock className="w-4 h-4" /> No {feedbackFilter} feedback
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {feedback.map(item => (
                                <FeedbackItem key={item.id} item={item} onSetStatus={setFeedbackStatus} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
