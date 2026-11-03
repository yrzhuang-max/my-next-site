'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
};

const STORAGE_KEY = 'cookie_consent';
const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  advertising: false,
};

function loadSavedConsent(): ConsentState {
  if (typeof window === 'undefined') return defaultConsent;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultConsent;
  try {
    return JSON.parse(raw) as ConsentState;
  } catch {
    return defaultConsent;
  }
}

type CookieConsentContextType = {
  consent: ConsentState;
  setConsent: (v: ConsentState) => void;
};

const CookieConsentContext = createContext<CookieConsentContextType>({
  consent: defaultConsent,
  setConsent: () => {},
});

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentState>(defaultConsent);

  useEffect(() => {
    setConsentState(loadSavedConsent());
  }, []);

  const setConsent = (newVal: ConsentState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
    setConsentState(newVal);
  };

  return (
    <CookieConsentContext.Provider value={{ consent, setConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  return useContext(CookieConsentContext);
}
