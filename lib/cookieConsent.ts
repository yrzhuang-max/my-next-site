export function getCookieConsent() {
  if (typeof window === 'undefined') return { necessary: true, analytics: false, advertising: false };
  const raw = localStorage.getItem('cookie_consent');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}