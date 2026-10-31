'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
};
// 和 CookieConsent.tsx 保持一致！
const STORAGE_KEY = 'cookie_consent';

export default function GdprScripts() {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setConsent(JSON.parse(raw));
    } else {
      setConsent({ necessary: true, analytics: false, advertising: false });
    }
  }, []);

  if (!consent) return null;

  return (
    <>
      {consent.analytics && (
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FTLGHYG3WH"
          strategy="afterInteractive"
        />
      )}
      {consent.advertising && (
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2652696013507160"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}