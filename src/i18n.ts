import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en.json';
import teTranslation from '../locales/te.json';
import hiTranslation from '../locales/hi.json';

const resources = {
  en: { translation: enTranslation },
  te: { translation: teTranslation },
  hi: { translation: hiTranslation },
};

const savedLang = localStorage.getItem('milan_lang') || 'te';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'te',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'milan_lang',
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  localStorage.setItem('milan_lang', lng);
});

export default i18n;
