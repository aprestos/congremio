export type LocaleCode = 'en' | 'pt'

export interface LocaleInfo {
  code: LocaleCode
  name: string
  nativeName: string
}

export const AVAILABLE_LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
]

export const DEFAULT_LOCALE: LocaleCode = 'en'

export const FALLBACK_LOCALE: LocaleCode = 'en'
