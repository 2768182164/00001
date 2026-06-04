import { createI18n } from 'vue-i18n';
import { Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US';
import zhCN from 'vant/es/locale/lang/zh-CN';
import en from './locales/en.json';
import zh from './locales/zh.json';

const STORAGE_KEY = 'tron-dapp-locale';
const DEFAULT_LOCALE = 'en';

export const SUPPORTED_LOCALES = ['en', 'zh'];

const VANT_LOCALE_MAP = {
  en: { name: 'en-US', messages: enUS },
  zh: { name: 'zh-CN', messages: zhCN }
};

export function getDefaultLocale() {
  if (typeof localStorage === 'undefined') return DEFAULT_LOCALE;
  const saved = localStorage.getItem(STORAGE_KEY);
  return SUPPORTED_LOCALES.includes(saved) ? saved : DEFAULT_LOCALE;
}

function applyVantLocale(locale) {
  const vant = VANT_LOCALE_MAP[locale];
  if (vant) Locale.use(vant.name, vant.messages);
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: { en, zh }
});

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  i18n.global.locale.value = locale;
  applyVantLocale(locale);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, locale);
  }
}

// Initial sync — pair Vant's locale with the resolved app locale at boot.
applyVantLocale(i18n.global.locale.value);

export default i18n;
