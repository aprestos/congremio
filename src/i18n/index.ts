import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import pt from './locales/pt.json'
import { DEFAULT_LOCALE, FALLBACK_LOCALE } from './types'
import type { LocaleCode } from './types'

export type MessageSchema = typeof en

// Load saved locale (this needs to be done before createI18n)
function getInitialLocale(): LocaleCode {
  const LOCALE_STORAGE_KEY = 'app-locale'
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (saved && (saved === 'en' || saved === 'pt')) {
      return saved as LocaleCode
    }
  } catch (error) {
    console.error('Failed to load locale from localStorage:', error)
  }

  // Fallback to browser locale
  try {
    const browserLang = navigator.language.split('-')[0]
    if (browserLang === 'en' || browserLang === 'pt') {
      return browserLang as LocaleCode
    }
  } catch (error) {
    console.error('Failed to get browser locale:', error)
  }

  return DEFAULT_LOCALE
}

export const i18n = createI18n<[MessageSchema], LocaleCode>({
  legacy: false, // Use Composition API mode
  locale: getInitialLocale(), // Use saved/browser locale instead of default
  fallbackLocale: FALLBACK_LOCALE,
  messages: {
    en,
    pt,
  },
  globalInjection: true,
  missingWarn: import.meta.env.DEV,
  fallbackWarn: import.meta.env.DEV,
})

export default i18n
