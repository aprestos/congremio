import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import pt from './locales/pt.json'
import { DEFAULT_LOCALE, FALLBACK_LOCALE } from './types'
import type { LocaleCode } from './types'

export type MessageSchema = typeof en

export const i18n = createI18n<[MessageSchema], LocaleCode>({
  legacy: false, // Use Composition API mode
  locale: DEFAULT_LOCALE,
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
