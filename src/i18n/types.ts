// Re-export TranslationSchema from English (the source of truth)
export type { TranslationSchema } from './locales/en'

/**
 * Helper type to make all properties optional recursively
 * Used for non-English locales to allow partial translations
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Note: For AVAILABLE_LOCALES, DEFAULT_LOCALE, FALLBACK_LOCALE, LocaleInfo
// import directly from '@/i18n' instead of '@/i18n/types'
