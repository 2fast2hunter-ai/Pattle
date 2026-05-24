import React, { useEffect, useRef } from 'react';

// Replace ADSENSE_PUBLISHER_ID with your real ca-pub-XXXXXXXXXXXXXXXX after AdSense approval.
// Also uncomment the AdSense script tag in index.html.
const ADSENSE_PUBLISHER_ID = 'ca-pub-PENDING';
const ADSENSE_SLOT_ID = '0000000000';

export default function BannerAd({ className = '' }) {
    const adRef = useRef(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current || !adRef.current) return;
        initialized.current = true;

        if (ADSENSE_PUBLISHER_ID.includes('PENDING')) return;

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('[BannerAd] AdSense init error:', e);
        }
    }, []);

    if (ADSENSE_PUBLISHER_ID.includes('PENDING')) {
        return (
            <div className={`w-full h-14 bg-slate-800/30 border border-slate-700/30 rounded-xl flex items-center justify-center ${className}`}>
                <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Advertisement</span>
            </div>
        );
    }

    return (
        <ins
            ref={adRef}
            className={`adsbygoogle ${className}`}
            style={{ display: 'block', minHeight: '56px' }}
            data-ad-client={ADSENSE_PUBLISHER_ID}
            data-ad-slot={ADSENSE_SLOT_ID}
            data-ad-format="auto"
            data-full-width-responsive="true"
        />
    );
}
