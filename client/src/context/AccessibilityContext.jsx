import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext(null);

const STORAGE_KEY = 'sahay_accessibility_prefs_v1';

const defaultPrefs = {
  theme: 'light', // 'light' | 'dark' | 'high-contrast' | 'hc-yellow'
  fontSize: 16,   // 14 to 26 px
  lineHeight: 1.6, // 1.5, 1.8, 2.2
  letterSpacing: 0, // 0, 0.05, 0.1 em
  fontFamily: 'sans', // 'sans' | 'dyslexic'
  reduceMotion: false,
  easyRead: false,
  ttsSpeed: 1.0,
  ttsVoice: null
};

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultPrefs, ...JSON.parse(saved) } : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Apply preferences dynamically to document element
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Could not save accessibility settings to localStorage:', e);
    }

    const root = document.documentElement;
    root.classList.remove('dark', 'theme-high-contrast', 'theme-hc-yellow', 'reduce-motion', 'font-dyslexic');
    root.removeAttribute('data-theme');

    if (prefs.theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (prefs.theme === 'high-contrast') {
      root.classList.add('theme-high-contrast');
      root.setAttribute('data-theme', 'high-contrast');
    } else if (prefs.theme === 'hc-yellow') {
      root.classList.add('dark', 'theme-hc-yellow');
      root.setAttribute('data-theme', 'hc-yellow');
    } else {
      root.setAttribute('data-theme', 'light');
    }

    if (prefs.reduceMotion) root.classList.add('reduce-motion');
    if (prefs.fontFamily === 'dyslexic') root.classList.add('font-dyslexic');

    root.style.setProperty('--font-size-base', `${prefs.fontSize}px`);
    root.style.setProperty('--line-height-current', `${prefs.lineHeight}`);
    root.style.setProperty('--letter-spacing-current', `${prefs.letterSpacing}em`);
  }, [prefs]);

  // Global keyboard shortcut: Alt + A opens accessibility panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsDrawerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updatePref = (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const resetPrefs = () => {
    setPrefs(defaultPrefs);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        prefs,
        updatePref,
        resetPrefs,
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer: () => setIsDrawerOpen((prev) => !prev)
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
