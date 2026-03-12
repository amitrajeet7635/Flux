'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface TranslationContextValue {
  translationEnabled: boolean;
  toggle: () => void;
}

const TranslationContext = createContext<TranslationContextValue>({
  translationEnabled: true,
  toggle: () => {},
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [translationEnabled, setTranslationEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('flux_translation_enabled');
    if (stored !== null) {
      setTranslationEnabled(stored === 'true');
    }
  }, []);

  const toggle = () => {
    setTranslationEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('flux_translation_enabled', String(next));
      return next;
    });
  };

  return (
    <TranslationContext.Provider value={{ translationEnabled, toggle }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
