import type { GameLocation } from '@/features/locations/model.ts'
import { supabase } from '@/lib/supabase.ts'
import { eventStore } from '@/stores/edition'
import { tenantStore } from '@/stores/tenant.ts'
import type { LibraryLocation } from '@/features/library/locations/location.model.ts'

export const locationService = {
  async get(): Promise<Array<LibraryLocation>> {
    try {
      let query = supabase
        .from('locations')
        .select()
        .eq('tenant_id', tenantStore.value?.id)
        .eq('edition_id', eventStore.value?.id)

      const result = await query
      console.log(result.data)
      return result.data as unknown[] as GameLocation[]
    } catch (error) {
      console.error((error as Error).message)
      return []
    }
  },
} as const
