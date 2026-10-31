'use client';
import { useState, useEffect } from 'react';
type CookieConsent = 'accepted' | 'rejected' | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cookieConsent') as CookieConsent;
    if (!saved) {
      setShowBanner(true);
    } else {
      setConsent(saved);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setConsent('accepted');
    setShowBanner(false);
    window.dispatchEvent(new CustomEvent('cookieConsentAccepted', { bubbles: true }));
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setConsent('rejected');
    setShowBanner(false);
  };

  const openCookieSettings = () => {
    setShowBanner(true);
  };

  useEffect(() => {
    // 类型更安全，去掉 any 粗暴断言
    (window as { openCookieConsentModal?: () => void }).openCookieConsentModal = openCookieSettings;
    return () => {
      delete (window as { openCookieConsentModal?: () => void }).openCookieConsentModal;
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
        <p className="text-gray-300 text-sm mb-4">
          We use essential cookies for website operation. Non-essential cookies, including analytics and advertising cookies from Google, help us analyze traffic and display relevant ads.
          You may accept or decline non-essential cookies.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded font-medium"
          >
            Accept Non-Essential
          </button>
          <button
            onClick={handleReject}
            className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded font-medium"
          >
            Reject Non-Essential
          </button>
          <a
            href="/legal/cookie-policy/"
            className="text-blue-300 underline text-sm ml-auto"
          >
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  );
}