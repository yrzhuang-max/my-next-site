'use client';
import { useState, useEffect } from 'react';

type CookieConsent = 'accepted' | 'rejected' | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [showBanner, setShowBanner] = useState(false);

  // 读取本地存储的cookie选择
  useEffect(() => {
    const saved = localStorage.getItem('cookieConsent') as CookieConsent;
    if (!saved) {
      setShowBanner(true);
    } else {
      setConsent(saved);
    }
  }, []);

  // 保存选择并触发全局事件，用来加载GA/Adsense脚本
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setConsent('accepted');
    setShowBanner(false);
    // 触发自定义事件，layout里面监听这个事件加载广告/GA
    window.dispatchEvent(new Event('cookieConsentAccepted'));
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setConsent('rejected');
    setShowBanner(false);
  };

  // 供Footer调用：重新打开弹窗修改设置
  const openCookieSettings = () => {
    setShowBanner(true);
  };

  // 挂载全局方法，Footer可以调用
  useEffect(() => {
    (window as any).openCookieConsentModal = openCookieSettings;
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
        <p className="text-gray-300 text-sm mb-4">
          We use cookies to analyze website traffic and optimize your experience.
          Cookies help us show relevant advertisements via Google AdSense.
          You can accept or reject non-essential cookies.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded font-medium"
          >
            Accept Cookies
          </button>
          <button
            onClick={handleReject}
            className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded font-medium"
          >
            Reject Non-Essential
          </button>
          <a
            href="/cookie-policy/"
            className="text-blue-300 underline text-sm self-center ml-auto"
          >
            Learn more (Cookie Policy)
          </a>
        </div>
      </div>
    </div>
  );
}