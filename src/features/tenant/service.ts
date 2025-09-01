import type { Tenant } from '@/features/tenant/tenant.model.ts'
import { supabase } from '@/lib/supabase.ts'

export const tenantService = {
  async get(): Promise<Array<Tenant>> {
    try {
      const result = await supabase.from('tenants').select('id,name,domain')
      return result.data as Tenant[]
    } catch (error) {
      console.error((error as Error).message)
      return []
    }
  },
  async getByDomain(domain: string): Promise<Tenant> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select()
        .or(`domain.eq.${domain},other_domains.cs.{${domain}}`)
        .single()

      if (error) {
        console.error('Error fetching tenant by domain:', error.message)
        throw error
      }

      return data as Tenant
    } catch (error) {
      console.error((error as Error).message)
      throw error
    }
  },
  async getById(id: string): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select()
        .eq('id', id)
        .single()
      if (error) {
        console.error((error as Error).message)
        return null
      }
      return data as Tenant
    } catch (error) {
      console.error((error as Error).message)
      return null
    }
  },
  async updateTenant(
    tenantId: string,
    updates: { email?: string; name?: string; logo?: string },
  ): Promise<Tenant | null> {
    try {
      // Filter out undefined values to only update defined fields
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([, value]) => value !== undefined),
      )

      // If no valid updates, return null
      if (Object.keys(filteredUpdates).length === 0) {
        console.warn('No valid updates provided for tenant')
        return null
      }

      const { data, error } = await supabase
        .from('tenants')
        .update(filteredUpdates)
        .eq('id', tenantId)
        .select()

      if (error) {
        console.error('Error updating tenant:', error.message)
        throw error
      }

      console.log(data)
      return null
      //return data as unknown as Tenant;
    } catch (error) {
      console.error('Failed to update tenant:', (error as Error).message)
      return null
    }
  },

  async generateReservationId(
    tenantId: string,
    editionId: string,
  ): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('generate_reservation_id', {
        p_tenant_id: tenantId,
        p_edition_id: editionId,
      })

      if (error) {
        console.error('Error generating reservation ID:', error.message)
        throw error
      }

      return data as number
    } catch (error) {
      console.error(
        'Failed to generate reservation ID:',
        (error as Error).message,
      )
      throw error
    }
  },
}

export default tenantService
