import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Sliders,
  Sun,
  Moon,
  Contrast,
  Type,
  MoveHorizontal,
  RotateCcw,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import Toggle from '../common/Toggle';
import Slider from '../common/Slider';
import Button from '../common/Button';
import LanguageSwitcher from '../common/LanguageSwitcher';

export function AccessibilityDrawer() {
  const { t } = useTranslation();
  const { prefs, updatePref, resetPrefs, isDrawerOpen, setIsDrawerOpen } = useAccessibility();
  const drawerRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (isDrawerOpen) {
      previouslyFocused.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        const firstFocusable = drawerRef.current?.querySelector('button, input, select');
        if (firstFocusable) firstFocusable.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsDrawerOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previouslyFocused.current?.focus) previouslyFocused.current.focus();
      };
    }
  }, [isDrawerOpen, setIsDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsDrawerOpen(false);
      }}
    >
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-settings-title"
        className="w-full max-w-md bg-[var(--bg-surface)] text-[var(--text-primary)] border-l-2 border-slate-300 dark:border-slate-700 shadow-2xl h-full flex flex-col justify-between overflow-y-auto p-6"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h2 id="accessibility-settings-title" className="text-xl font-bold">
                {t('drawer.title', 'Accessibility Controls')}
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close accessibility controls"
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg touch-target focus-visible:outline-none"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
            {t('drawer.subtitle', 'Customise your display preferences. Settings save automatically to your browser. Shortcut: Alt + A')}
          </p>

          <div className="space-y-6">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t('drawer.interface_language', 'Interface Language')}
              </label>
              <LanguageSwitcher />
            </div>

            {/* 1. Theme Selection */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t('drawer.theme_label', 'Color Contrast & Theme')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updatePref('theme', 'light')}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold touch-target transition-all ${
                    prefs.theme === 'light'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-300 dark:bg-blue-950 dark:text-blue-100'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{t('drawer.theme_light', 'Light Mode')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => updatePref('theme', 'dark')}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold touch-target transition-all ${
                    prefs.theme === 'dark'
                      ? 'border-blue-500 bg-blue-900/60 text-white ring-2 ring-blue-400'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Moon className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{t('drawer.theme_dark', 'Dark Mode')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => updatePref('theme', 'high-contrast')}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-bold touch-target transition-all ${
                    prefs.theme === 'high-contrast'
                      ? 'border-black bg-black text-white ring-2 ring-slate-400'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Contrast className="w-4 h-4 shrink-0" />
                  <span>{t('drawer.theme_hc', 'High Contrast B&W')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => updatePref('theme', 'hc-yellow')}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-bold touch-target transition-all ${
                    prefs.theme === 'hc-yellow'
                      ? 'border-yellow-400 bg-black text-yellow-300 ring-2 ring-cyan-400'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block shrink-0 border border-black" />
                  <span>{t('drawer.theme_yellow', 'Yellow on Black')}</span>
                </button>
              </div>
            </div>

            {/* 2. Text Sizing */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="font-size-slider" className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('drawer.text_size', 'Text Size')}: {prefs.fontSize}px
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => updatePref('fontSize', Math.max(14, prefs.fontSize - 2))}
                    className="px-2.5 py-1 text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 touch-target"
                    aria-label="Decrease text size"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => updatePref('fontSize', Math.min(26, prefs.fontSize + 2))}
                    className="px-2.5 py-1 text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 touch-target"
                    aria-label="Increase text size"
                  >
                    A+
                  </button>
                </div>
              </div>
              <input
                type="range"
                id="font-size-slider"
                min="14"
                max="26"
                step="1"
                value={prefs.fontSize}
                onChange={(e) => updatePref('fontSize', Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* 3. Dyslexia Font Toggle */}
            <Toggle
              label={t('drawer.dyslexia_font', 'Dyslexia-Friendly Font (Lexend)')}
              description={t('drawer.dyslexia_font_desc', 'Uses heavier bottom-weighted letterforms that reduce letter inversion and skipping')}
              checked={prefs.fontFamily === 'dyslexic'}
              onChange={(val) => updatePref('fontFamily', val ? 'dyslexic' : 'sans')}
            />

            {/* 4. Line Spacing */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t('drawer.line_spacing', 'Line Spacing')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t('drawer.spacing_normal', 'Normal'), value: 1.6 },
                  { label: t('drawer.spacing_relaxed', 'Relaxed'), value: 1.85 },
                  { label: t('drawer.spacing_spacious', 'Spacious'), value: 2.2 }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updatePref('lineHeight', opt.value)}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold touch-target ${
                      prefs.lineHeight === opt.value
                        ? 'border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 font-bold'
                        : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Easy-Read Mode Toggle */}
            <Toggle
              label={t('drawer.easy_read', 'Easy-Read Mode (Simple Language)')}
              description={t('drawer.easy_read_desc', 'Replaces dense medical paragraphs with simplified bullet points, clear verbs, and visual icons')}
              checked={prefs.easyRead}
              onChange={(val) => updatePref('easyRead', val)}
            />

            {/* 6. Reduced Motion */}
            <Toggle
              label={t('drawer.reduce_motion', 'Reduce Motion & Animations')}
              description={t('drawer.reduce_motion_desc', 'Eliminates page transitions, sliding effects, and moving visual elements')}
              checked={prefs.reduceMotion}
              onChange={(val) => updatePref('reduceMotion', val)}
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetPrefs}
            icon={RotateCcw}
          >
            {t('drawer.reset_defaults', 'Reset Defaults')}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsDrawerOpen(false)}
          >
            {t('drawer.apply_close', 'Apply & Close')}
          </Button>
        </div>
      </aside>
    </div>
  );
}

export default AccessibilityDrawer;
