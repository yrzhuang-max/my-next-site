'use client';
import Script from 'next/script';
import { useState } from 'react';

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
};
// 和 CookieConsent.tsx 保持一致！
const STORAGE_KEY = 'cookie_consent';

function loadConsent(): ConsentState {
  if (typeof window === 'undefined') {
    return { necessary: true, analytics: false, advertising: false };
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { necessary: true, analytics: false, advertising: false };
  }
  try {
    return JSON.parse(raw) as ConsentState;
  } catch {
    return { necessary: true, analytics: false, advertising: false };
  }
}

export default function GdprScripts() {
  const [consent] = useState<ConsentState>(loadConsent);

  return (
    <>
      {consent.analytics && (
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FTLGHYG3WH"
          strategy="afterInteractive"
        />
      )}
      {consent.advertising && (
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2652696013507160"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
