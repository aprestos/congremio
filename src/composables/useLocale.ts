import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Composer } from 'vue-i18n'
import type { LocaleCode, LocaleInfo } from '@/i18n/types'
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@/i18n/types'

interface UseLocaleReturn {
  locale: Composer['locale']
  availableLocales: LocaleInfo[]
  currentLocale: Readonly<ComputedRef<LocaleInfo | undefined>>
  setLocale: (code: LocaleCode) => void
  t: Composer['t']
  d: Composer['d']
  n: Composer['n']
}

const LOCALE_STORAGE_KEY = 'app-locale'

/**
 * Get the browser's preferred locale
 */
function getBrowserLocale(): LocaleCode {
  try {
    const browserLang = navigator.language.split('-')[0] // Get 'pt' from 'pt-PT' or 'pt-BR'
    const supportedLocale = AVAILABLE_LOCALES.find(
      (l) => l.code === browserLang,
    )
    return supportedLocale?.code || DEFAULT_LOCALE
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

  const setLocale = (code: LocaleCode): void => {
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
export function loadSavedLocale(): LocaleCode {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (saved && AVAILABLE_LOCALES.some((l) => l.code === saved)) {
      return saved as LocaleCode
    }
  } catch (error) {
    console.error('Failed to load locale from localStorage:', error)
  }

  // Fallback to browser locale
  return getBrowserLocale()
}
