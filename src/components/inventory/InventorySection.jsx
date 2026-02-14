import React from 'react';

export default function InventorySection({ title, icon: Icon, children, className = "" }) {
    if (!children) return null;

    // Check if children is an array and empty, or falsey
    if (Array.isArray(children) && children.length === 0) return null;

    return (
        <div className={`animate-in slide-in-from-bottom-4 duration-500 ${className}`}>
            <h3 className="text-sm font-black text-slate-300 uppercase mb-3 ml-1 flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-slate-400" />} {title}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {children}
            </div>
        </div>
    );
}
