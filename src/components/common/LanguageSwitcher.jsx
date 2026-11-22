import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { changeLanguage } from '../../i18n';

export function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिंदी (Hindi)', short: 'हि' },
    { code: 'te', label: 'తెలుగు (Telugu)', short: 'తె' }
  ];

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    changeLanguage(code);
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Globe className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700" role="group" aria-label="Language selection">
        {languages.map((l) => {
          const isActive = currentLang === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => handleSelect(l.code)}
              aria-pressed={isActive}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all touch-target focus-visible:outline-none ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={l.label}
            >
              {l.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
