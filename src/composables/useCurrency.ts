import {
  type Icon,
  IconCurrencyDollar,
  IconCurrencyEuro,
  IconCurrencyPound,
  IconCurrencyYen,
} from '@tabler/icons-vue'

export function getCurrencyIcon(currency: string): Icon | undefined {
  switch (currency) {
    case 'USD':
      return IconCurrencyDollar
    case 'EUR':
      return IconCurrencyEuro
    case 'GBP':
      return IconCurrencyPound
    case 'JPY':
      return IconCurrencyYen
    default:
      return undefined
  }
}
