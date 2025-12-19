import {
  createRule,
  type Maybe,
  type RegleRuleWithParamsDefinition,
} from '@regle/core'
import { DateTime } from 'luxon'

export function dateAfterField<T extends Record<string, unknown>>(
  field: keyof T,
  label: string,
): RegleRuleWithParamsDefinition<string, [ctx: T], false> {
  return createRule({
    validator(value: Maybe<string>, ctx: T): boolean {
      const compareValue = ctx[field]
      if (!value || !compareValue) return true
      const currentDate = DateTime.fromISO(value)
      const compareDate = DateTime.fromISO(compareValue as string)
      return currentDate > compareDate
    },
    message: () => `Date must be after ${label}`,
  })
}
