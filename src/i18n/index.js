import { createI18n } from 'vue-i18n';
import en from './en';
import zh from './zh';

const STORAGE_KEY = 'tron-dapp-locale';

export const SUPPORTED_LOCALES = ['en', 'zh'];

export function getDefaultLocale() {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
  return 'en';
}

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  i18n.global.locale.value = locale;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, locale);
  }
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: { en, zh }
});

export default i18n;
