import type { Tenant } from '@/features/tenant/tenant.model.ts'
import { supabase } from '@/lib/supabase.ts'
import { matchDomain } from './domain-matcher'

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
      // First, try exact match for better performance
      const { data, error } = await supabase
        .from('tenants')
        .select()
        .or(`domain.eq.${domain},other_domains.cs.{${domain}}`)
        .single()

      // If exact match found, return it
      if (!error && data) {
        return data as Tenant
      }

      // If no exact match, fetch all tenants and check for wildcard matches
      const { data: allTenants, error: allError } = await supabase
        .from('tenants')
        .select()

      if (allError) {
        console.error('Error fetching all tenants:', allError.message)
        throw allError
      }

      // Type for tenant record from database that may have other_domains
      interface TenantRecord extends Tenant {
        other_domains?: string[]
      }

      // Check domain field for wildcard match
      const matchedTenant = (allTenants as TenantRecord[] | null)?.find(
        (tenant) => {
          // Check if domain matches with wildcard
          if (tenant.domain && matchDomain(tenant.domain, domain)) {
            return true
          }
          // Check if any other_domains match with wildcard
          if (tenant.other_domains && Array.isArray(tenant.other_domains)) {
            return tenant.other_domains.some((otherDomain: string) =>
              matchDomain(otherDomain, domain),
            )
          }
          return false
        },
      )

      if (!matchedTenant) {
        throw new Error(`No tenant found for domain: ${domain}`)
      }

      return matchedTenant as Tenant
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
