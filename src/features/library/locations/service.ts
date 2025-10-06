import { supabase } from '@/lib/supabase.ts'
import { eventStore } from '@/stores/edition'
import { tenantStore } from '@/stores/tenant.ts'
import type { LibraryLocation } from '@/features/library/locations/location.model.ts'

export const libraryLocationService = {
  async search(query: string): Promise<Array<LibraryLocation>> {
    try {
      const result = await supabase
        .from('locations')
        .select('*')
        .eq('tenant_id', tenantStore.value?.id)
        .eq('edition_id', eventStore.value?.id)
        .or(`name.ilike.%${query}%`)

      return result.data as LibraryLocation[]
    } catch (error) {
      console.error('Search error:', (error as Error).message)
      return []
    }
  },
  async get(): Promise<Array<LibraryLocation>> {
    try {
      const result = await supabase
        .from('locations')
        .select('*')
        .eq('tenant_id', tenantStore.value?.id)
        .eq('edition_id', eventStore.value?.id)

      return result.data as LibraryLocation[]
    } catch (error) {
      console.error('get error:', (error as Error).message)
      return []
    }
  },
} as const
