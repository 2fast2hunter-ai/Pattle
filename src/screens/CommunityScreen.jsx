import React, { useState } from 'react';
import { ArrowLeft, Users, Pin, AlertCircle, Loader2, ExternalLink, Plus } from 'lucide-react';
import { auth } from '../firebase';
import { useCommunityPosts } from '../hooks/useCommunityPosts';
import { seedGuildShowcasePost, DISCORD_URL } from '../utils/communityDb';

const ADMIN_EMAIL = '2fast2hunter@gmail.com';

const CATEGORY_LABELS = {
  community_event: 'Community Event',
  announcement: 'Ankündigung',
  general: 'Allgemein',
};

const CATEGORY_COLORS = {
  community_event: 'from-purple-600 to-pink-600',
  announcement: 'from-red-600 to-orange-500',
  general: 'from-slate-600 to-slate-700',
};

function PostCard({ post }) {
  const isPinned = post.isPinned;
  const categoryLabel = CATEGORY_LABELS[post.category] || post.category;
  const categoryGradient = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general;
  const ts = post.timestamp?.toDate ? post.timestamp.toDate() : null;
  const dateStr = ts
    ? ts.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';

  const handleCta = () => {
    if (post.ctaAction === 'discord') {
      window.open(DISCORD_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border ${
      isPinned
        ? 'border-yellow-500/40 shadow-lg shadow-yellow-900/20'
        : 'border-white/5'
    } bg-slate-900`}>

      {isPinned && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500" />
      )}

      {/* Header */}
      <div className={`px-4 pt-4 pb-3 bg-gradient-to-br ${categoryGradient} bg-opacity-10`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isPinned && (
              <span className="inline-flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                <Pin className="w-3 h-3" />
                Angepinnt
              </span>
            )}
            <span className={`inline-flex bg-gradient-to-r ${categoryGradient} text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full`}>
              {categoryLabel}
            </span>
          </div>
          <span className="text-slate-500 text-xs font-bold shrink-0">{dateStr}</span>
        </div>

        <h3 className="text-white font-black text-base mt-2 leading-snug">{post.title}</h3>

        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-base">{post.authorAvatar}</span>
          <span className="text-slate-400 text-xs font-bold">{post.authorName}</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{post.body}</p>
      </div>

      {/* CTA */}
      {post.ctaLabel && post.ctaAction && (
        <div className="px-4 pb-4">
          <button
            onClick={handleCta}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-black text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            {post.ctaLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CommunityScreen({ user, onBack }) {
  const { posts, loading, error } = useCommunityPosts();
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState(null);

  const isAdmin = auth.currentUser?.email === ADMIN_EMAIL;

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg(null);
    try {
      const result = await seedGuildShowcasePost();
      setSeedMsg(result.alreadyExists ? 'Post existiert bereits.' : 'Post erstellt ✅');
    } catch (e) {
      console.error('[Community] seed error:', e);
      setSeedMsg('Fehler beim Erstellen.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-300 relative bg-slate-950">

      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center gap-3 pt-2 pb-3 px-4 shrink-0 z-10 border-b border-white/5">
        <button
          onClick={onBack}
          className="p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5 backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Users className="w-5 h-5 text-purple-400" />
        <h2 className="text-2xl font-black italic tracking-wide text-white uppercase">
          Community
        </h2>

        {isAdmin && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            title="Admin: Guild Showcase Post erstellen"
            className="ml-auto p-2 bg-yellow-600/20 border border-yellow-500/30 text-yellow-400 rounded-full hover:bg-yellow-600/30 transition-colors disabled:opacity-40"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          </button>
        )}
      </div>

      {seedMsg && (
        <div className="px-4 pt-2 shrink-0 relative z-10">
          <div className="bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-300 text-xs font-bold text-center">
            {seedMsg}
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-4 scrollbar-hide relative z-10">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 text-rose-400 gap-2">
            <AlertCircle className="w-8 h-8 opacity-60" />
            <p className="text-sm font-bold text-center">
              Community-Posts konnten nicht geladen werden.
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 gap-3">
            <Users className="w-12 h-12 opacity-20" />
            <p className="text-sm font-bold text-center">Noch keine Posts vorhanden.</p>
          </div>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
