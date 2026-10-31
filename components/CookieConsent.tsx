'use client';
import { useEffect, useState } from 'react';

type Consent = {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
};

// 扩展window类型，消除any
declare global {
  interface Window {
    openCookieConsentModal?: () => void;
    gtag?: (...args: unknown[]) => void;
  }
}

// ✅ 和 GdprScripts 统一 storage key
const STORAGE_KEY = 'cookie_consent';
const defaultConsent: Consent = {
  necessary: true,
  analytics: false,
  advertising: false,
};

// 初始化读取本地存储，只在组件首次渲染时执行一次
function loadInitialConsent(): { consent: Consent; shouldShow: boolean } {
  if (typeof window === 'undefined') {
    return { consent: defaultConsent, shouldShow: false };
  }
  const savedRaw = localStorage.getItem(STORAGE_KEY);
  if (!savedRaw) {
    return { consent: defaultConsent, shouldShow: true };
  }
  try {
    const parsed = JSON.parse(savedRaw) as Consent;
    return { consent: parsed, shouldShow: false };
  } catch {
    return { consent: defaultConsent, shouldShow: true };
  }
}

export default function CookieConsent() {
  const initial = loadInitialConsent();
  const [show, setShow] = useState(initial.shouldShow);
  const [consent, setConsent] = useState<Consent>(initial.consent);

  const applyGtagConsent = (c: Consent) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.advertising ? 'granted' : 'denied',
      ad_user_data: c.advertising ? 'granted' : 'denied',
      ad_personalization: c.advertising ? 'granted' : 'denied',
    });
  };

  // 【Effect1：暴露全局打开弹窗方法】
  useEffect(() => {
    window.openCookieConsentModal = () => {
      if (typeof window === 'undefined') return;
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      if (savedRaw) {
        try {
          const parsed = JSON.parse(savedRaw) as Consent;
          setConsent(parsed);
        } catch {
          setConsent(defaultConsent);
        }
      }
      setShow(true);
    };
    return () => {
      delete window.openCookieConsentModal;
    };
  }, []);

  // 【Effect2：consent变更时同步gtag，是合法effect用法】
  useEffect(() => {
    applyGtagConsent(consent);
  }, [consent]);

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
