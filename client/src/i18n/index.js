import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';

const savedLang = typeof window !== 'undefined'
  ? localStorage.getItem('sahay_lang') || 'en'
  : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    te: { translation: te }
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  try {
    localStorage.setItem('sahay_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  } catch (e) {}
};

export default i18n;
