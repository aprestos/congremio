import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Composer } from 'vue-i18n'
import type { LocaleInfo } from '@/i18n'
import {
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
  AVAILABLE_LOCALE_CODES,
} from '@/i18n'

interface UseLocaleReturn {
  locale: Composer['locale']
  availableLocales: LocaleInfo[]
  currentLocale: Readonly<ComputedRef<LocaleInfo | undefined>>
  setLocale: (code: string) => void
  t: Composer['t']
  d: Composer['d']
  n: Composer['n']
}

const LOCALE_STORAGE_KEY = 'app-locale'

/**
 * Check if a locale code is valid (has a translation file)
 */
function isValidLocale(code: string): boolean {
  return AVAILABLE_LOCALE_CODES.includes(code)
}

/**
 * Get the browser's preferred locale
 */
function getBrowserLocale(): string {
  try {
    const browserLang = navigator.language.split('-')[0] ?? ''
    if (browserLang && isValidLocale(browserLang)) {
      return browserLang
    }
    return DEFAULT_LOCALE
  } catch (error) {
    console.error('Failed to get browser locale:', error)
    return DEFAULT_LOCALE
  }
}

/**
 * Composable for managing application locale
 */
export function useLocale(): UseLocaleReturn {
  const { locale, t, d, n } = useI18n()

  const currentLocale = computed(() => {
    return AVAILABLE_LOCALES.find((l) => l.code === locale.value)
  })

  const setLocale = (code: string): void => {
    if (!isValidLocale(code)) {
      console.warn(`Invalid locale code: ${code}`)
      return
    }
    locale.value = code
    // Save to localStorage
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code)
    } catch (error) {
      console.error('Failed to save locale to localStorage:', error)
    }
  }

  return {
    locale,
    availableLocales: AVAILABLE_LOCALES,
    currentLocale,
    setLocale,
    t,
    d,
    n,
  }
}

/**
 * Load saved locale from localStorage with browser locale as fallback
 */
export function loadSavedLocale(): string {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (saved && isValidLocale(saved)) {
      return saved
    }
  } catch (error) {
    console.error('Failed to load locale from localStorage:', error)
  }

  // Fallback to browser locale
  return getBrowserLocale()
}
