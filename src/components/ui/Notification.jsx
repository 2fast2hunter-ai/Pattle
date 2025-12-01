// src/components/ui/Notification.jsx
import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Notification({ notification }) {
    if (!notification) return null;
    
    // Die Logik für die Positionierung und den Stil (aus der alten App.jsx)
    const baseClasses = "absolute top-4 left-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300";
    
    const typeClasses = notification.type === 'error'
        ? 'bg-red-500/90 border border-red-400 text-white'
        : 'bg-green-500/90 border border-green-400 text-white';

    const Icon = notification.type === 'error' ? AlertCircle : CheckCircle2;

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            <Icon className="w-6 h-6 flex-shrink-0" />
            <span className="font-bold text-sm shadow-black drop-shadow-md">
                {notification.message}
            </span>
        </div>
    );
}