import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_CATEGORIES } from '../data/faqData';

function StepBadge({ number }) {
    return (
        <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
            {number}
        </span>
    );
}

function FAQEntry({ entry }) {
    const [open, setOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="rounded-2xl bg-slate-900 border border-white/5 overflow-hidden">
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-slate-800/50 transition-colors"
            >
                <span className="font-bold text-white text-sm pr-4">{entry.question}</span>
                {open ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
            </button>

            {open && (
                <div className="border-t border-white/5 px-4 pb-4 space-y-5 pt-4">
                    {entry.steps && entry.steps.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Schritt-für-Schritt</p>
                            <ol className="space-y-3">
                                {entry.steps.map((step, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <StepBadge number={i + 1} />
                                        <div>
                                            <p className="text-sm font-bold text-white">{step.title}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {entry.faqs && entry.faqs.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Häufige Fragen</p>
                            {entry.faqs.map((faq, i) => (
                                <div key={i} className="rounded-xl bg-slate-800/50 border border-white/5 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-700/40 transition-colors"
                                    >
                                        <span className="text-xs font-bold text-slate-300 pr-3">{faq.q}</span>
                                        {openFaq === i
                                            ? <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            : <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                        }
                                    </button>
                                    {openFaq === i && (
                                        <p className="px-3 pb-3 text-xs text-slate-400 border-t border-white/5 pt-2">{faq.a}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function HelpCenterScreen({ onBack, t }) {
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
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-black italic tracking-wide text-white">HILFE-CENTER</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
                {FAQ_CATEGORIES.map(cat => (
                    <div key={cat.id} className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                            <span>{cat.icon}</span> {cat.label}
                        </h3>
                        <div className="space-y-2">
                            {cat.entries.map(entry => (
                                <FAQEntry key={entry.id} entry={entry} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
