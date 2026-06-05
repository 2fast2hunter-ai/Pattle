import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2, MessageCircle, Hash } from 'lucide-react';
import { listenToGuildChat, sendGuildMessage } from '../utils/guildDb';

function ChatBubble({ msg, isMe }) {
    const timeStr = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {!isMe && (
                <div className="w-8 h-8 rounded-xl bg-slate-700/60 flex items-center justify-center text-base shrink-0 mt-1">
                    {msg.avatar || '🛡️'}
                </div>
            )}
            <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                {!isMe && (
                    <span className="text-[10px] font-bold text-slate-400 px-1">{msg.username}</span>
                )}
                <div className={`px-3 py-2 rounded-2xl text-sm leading-snug break-words ${
                    isMe
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : 'bg-slate-800 text-slate-100 rounded-tl-sm'
                }`}>
                    {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 px-1">{timeStr}</span>
            </div>
        </div>
    );
}

export default function GuildChatScreen({ user, onBack }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!user?.guildId) return;

        const unsub = listenToGuildChat(user.guildId, (msgs) => {
            setMessages(msgs);
            setLoading(false);
        });

        return () => unsub();
    }, [user?.guildId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || sending || !user?.guildId) return;

        setInput('');
        setSending(true);
        await sendGuildMessage(user, user.guildId, text);
        setSending(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!user?.guildId) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-500">
                <MessageCircle className="w-12 h-12 opacity-30" />
                <p className="text-sm font-bold">Join a guild to access guild chat.</p>
                <button onClick={onBack} className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm font-bold">← Back</button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-950 animate-in fade-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-3 pb-3 border-b border-white/5 shrink-0">
                <button
                    onClick={onBack}
                    className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-indigo-400" />
                        <span className="font-black text-white uppercase tracking-wide text-sm">Guild Chat</span>
                        {user.guildTag && (
                            <span className="inline-flex items-center gap-0.5 bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider">
                                <Hash className="w-2.5 h-2.5" />{user.guildTag}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
                {loading && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    </div>
                )}
                {!loading && messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-slate-600 gap-2">
                        <MessageCircle className="w-8 h-8 opacity-40" />
                        <p className="text-xs font-bold">No messages yet. Say hello!</p>
                    </div>
                )}
                {messages.map(msg => (
                    <ChatBubble key={msg.id} msg={msg} isMe={msg.userId === user.id} />
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-6 pt-3 border-t border-white/5 shrink-0">
                <div className="flex gap-2 items-end">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        maxLength={200}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-800 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-5 max-h-24 overflow-y-auto"
                        style={{ minHeight: '44px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={sending || !input.trim()}
                        className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-2xl transition-colors shrink-0"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
