import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Send, Loader2, AlertCircle } from 'lucide-react';
import { useGlobalChat } from '../hooks/useGlobalChat';
import { findUserPublic } from '../utils/db';

const MAX_LENGTH = 200;

export default function ChatScreen({ user, onBack, onViewPlayer, t }) {
  const { messages, loading, error, sending, sendMessage } = useGlobalChat(user);
  const [text, setText] = useState('');
  const [sendError, setSendError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSendError(null);
    setText('');
    const result = await sendMessage(trimmed);
    if (!result.success) {
      setText(trimmed);
      if (result.reason !== 'cooldown') {
        setSendError(result.reason === 'permission' ? 'no_permission' : 'send_failed');
      }
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClickPlayer = async (msg) => {
    if (msg.senderId === user.id) {
      onViewPlayer(null);
      return;
    }
    const playerData = await findUserPublic(msg.senderId);
    if (playerData) onViewPlayer(playerData);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">

      {/* Background gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-900/10 to-transparent pointer-events-none" />

      {/* HEADER */}
      <div className="relative flex items-center gap-3 pt-2 pb-3 px-4 shrink-0 z-10 border-b border-white/5">
        <button
          onClick={onBack}
          className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <MessageCircle className="w-5 h-5 text-indigo-400" />
        <h2 className="text-2xl font-black italic tracking-wide text-white uppercase">
          {t ? t('chat_title') : 'GLOBAL CHAT'}
        </h2>
        <span className="ml-auto text-xs text-slate-500 font-bold">
          {messages.length}/50
        </span>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 space-y-3 scrollbar-hide relative z-10">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 text-rose-400 gap-2">
            <AlertCircle className="w-8 h-8 opacity-60" />
            <p className="text-sm font-bold text-center px-4">
              {error === 'permission'
                ? 'Chat unavailable — please reload the app.'
                : 'Failed to load messages. Check your connection.'}
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-500 gap-2">
            <MessageCircle className="w-8 h-8 opacity-30" />
            <p className="text-sm font-bold">
              {t ? t('chat_no_messages') : 'No messages yet. Say something!'}
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <ChatMessage
              key={msg.id}
              msg={msg}
              isMe={msg.senderId === user.id}
              onClickPlayer={handleClickPlayer}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* SEND ERROR */}
      {sendError && (
        <div className="px-4 py-2 shrink-0 relative z-10">
          <div className="flex items-center gap-2 bg-rose-900/40 border border-rose-500/30 rounded-xl px-3 py-2 text-rose-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {sendError === 'no_permission'
              ? 'Could not send — chat is temporarily unavailable.'
              : 'Message failed to send. Please try again.'}
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="px-4 pb-4 pt-2 shrink-0 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2 bg-slate-800/50 border border-white/10 rounded-2xl p-2 backdrop-blur-md">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={e => setText(e.target.value.slice(0, MAX_LENGTH))}
            onKeyDown={handleKeyDown}
            placeholder={t ? t('chat_placeholder') : 'Type a message...'}
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none px-2"
            disabled={sending}
            maxLength={MAX_LENGTH}
          />
          <span className="text-[10px] text-slate-600 font-mono shrink-0">
            {text.length}/{MAX_LENGTH}
          </span>
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="p-2 bg-indigo-600 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending
              ? <Loader2 className="w-4 h-4 animate-spin text-white" />
              : <Send className="w-4 h-4 text-white" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ msg, isMe, onClickPlayer }) {
  const ts = msg.timestamp?.toDate ? msg.timestamp.toDate() : null;
  const timeStr = ts
    ? ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <button
        onClick={() => onClickPlayer(msg)}
        className="shrink-0 w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-base hover:border-indigo-500/50 transition-colors mb-4"
        title={msg.senderName}
      >
        {msg.senderAvatar}
      </button>

      <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Name + level */}
        <button
          onClick={() => onClickPlayer(msg)}
          className={`text-xs font-bold mb-0.5 hover:underline transition-colors ${isMe ? 'text-indigo-400' : 'text-slate-400'}`}
        >
          {msg.senderName}
          <span className="text-slate-600 font-normal ml-1">Lv.{msg.senderLevel}</span>
        </button>

        {/* Bubble */}
        <div className={`px-3 py-2 rounded-2xl text-sm text-white break-words leading-relaxed ${
          isMe
            ? 'bg-indigo-700/60 rounded-tr-sm border border-indigo-500/30'
            : 'bg-slate-800/60 rounded-tl-sm border border-white/5'
        }`}>
          {msg.text}
        </div>

        {timeStr && (
          <span className="text-[10px] text-slate-600 mt-0.5">{timeStr}</span>
        )}
      </div>
    </div>
  );
}
