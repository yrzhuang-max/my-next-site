'use client';
import { useEffect, useState } from 'react';

type Consent = {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
};

// ✅ 和 GdprScripts 统一 storage key
const STORAGE_KEY = 'cookie_consent';
const defaultConsent: Consent = {
  necessary: true,
  analytics: false,
  advertising: false,
};

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [consent, setConsent] = useState<Consent>(defaultConsent);

  const applyGtagConsent = (c: Consent) => {
    if (typeof window === 'undefined' || !(window as any).gtag) return;
    (window as any).gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.advertising ? 'granted' : 'denied',
      ad_user_data: c.advertising ? 'granted' : 'denied',
      ad_personalization: c.advertising ? 'granted' : 'denied',
    });
  };

  // 暴露全局方法，给Footer的Cookie Settings按钮调用，打开前回填保存的配置
  useEffect(() => {
    (window as any).openCookieConsentModal = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Consent;
          setConsent(parsed);
        } catch {}
      }
      setShow(true);
    };
    return () => {
      delete (window as any).openCookieConsentModal;
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setShow(true);
      return;
    }
    try {
      const parsed = JSON.parse(saved) as Consent;
      setConsent(parsed);
      applyGtagConsent(parsed);
    } catch {
      setShow(true);
    }
  }, []);

  const save = (c: Consent) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    setConsent(c);
    applyGtagConsent(c);
    setShow(false);
    // ✅ 保存后刷新，让GdprScripts重新读取配置、加载/移除脚本
    window.location.reload();
  };

  const acceptAll = () => {
    save({ necessary: true, analytics: true, advertising: true });
  };
  const acceptNecessary = () => {
    save({ necessary: true, analytics: false, advertising: false });
  };
  const saveCustom = () => {
    save(consent);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookie Notice</h3>
        <p className="text-sm text-gray-600 mb-4">
          We use cookies to operate this website, improve experience, show ads and analyze traffic.
          You can choose which types to allow. Necessary cookies cannot be disabled.
        </p>
        <div className="space-y-3 mb-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked disabled className="accent-blue-600" />
            <span>Necessary (required)</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={consent.analytics}
              onChange={(e) => setConsent(p => ({ ...p, analytics: e.target.checked }))}
              className="accent-blue-600"
            />
            <span>Analytics / Statistics</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={consent.advertising}
              onChange={(e) => setConsent(p => ({ ...p, advertising: e.target.checked }))}
              className="accent-blue-600"
            />
            <span>Advertising / Marketing</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <a href="/legal/cookie-policy" className="text-sm text-blue-600 hover:underline">
            Cookie Policy
          </a>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={acceptNecessary}
              className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              Only Necessary
            </button>
            <button
              onClick={saveCustom}
              className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              Save My Choice
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}