import type { GameLocation } from '@/features/locations/model.ts'
import { supabase } from '@/lib/supabase.ts'
import { eventStore } from '@/stores/event.ts'
import { tenantStore } from '@/stores/tenant.ts'

export const locationService = {
  async get(): Promise<Array<GameLocation>> {
    try {
      let query = supabase
        .from('locations')
        .select()
        .eq('tenant_id', tenantStore.value?.id)
        .eq('event_id', eventStore.value?.id)

      const result = await query
      console.log(result.data)
      return result.data as unknown[] as GameLocation[]
    } catch (error) {
      console.error((error as Error).message)
      return []
    }
  },
} as const
