import type { LibraryGame } from "@/features/library/game.model.ts";
import type { Tenant } from "@/features/tenant/tenant.model.ts";
import { supabase } from "@/lib/supabase.ts";

export const tenantService = {
  async get(): Promise<Array<LibraryGame>> {
    try {
      const result = await supabase.from("tenants").select("id,name,domain");
      return result.data as unknown[] as LibraryGame[];
    } catch (error) {
      console.error((error as Error).message);
      return [];
    }
  },
  async getByDomain(domain: string): Promise<Tenant> {
    try {
      // First try to find by main domain
      let { data, error } = await supabase
        .from("tenants")
        .select()
        .eq("domain", domain)
        .single();

      // If not found in main domain, check other_domains array
      if (error && error.code === "PGRST116") {
        // No rows found
        const { data: tenantsData, error: tenantsError } = await supabase
          .from("tenants")
          .select()
          .contains("other_domains", [domain]);

        if (tenantsError) {
          console.error("Error searching other_domains:", tenantsError.message);
          throw tenantsError;
        }

        if (tenantsData && tenantsData.length > 0) {
          data = tenantsData[0];
          error = null;
        } else {
          console.error(`No tenant found for domain: ${domain}`);
          throw new Error(`No tenant found for domain: ${domain}`);
        }
      } else if (error) {
        console.error("Error fetching tenant by domain:", error.message);
        throw error;
      }

      return data as Tenant;
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  },
  async getById(id: string): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from("tenants")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        console.error((error as Error).message);
        return null;
      }
      return data as Tenant;
    } catch (error) {
      console.error((error as Error).message);
      return null;
    }
  },
  async updateTenant(
    tenantId: string,
    updates: { email?: string; name?: string; logo?: string },
  ): Promise<Tenant | null> {
    try {
      // Filter out undefined values to only update defined fields
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined),
      );

      // If no valid updates, return null
      if (Object.keys(filteredUpdates).length === 0) {
        console.warn("No valid updates provided for tenant");
        return null;
      }

      const { data, error } = await supabase
        .from("tenants")
        .update(filteredUpdates)
        .eq("id", tenantId)
        .select();

      if (error) {
        console.error("Error updating tenant:", error.message);
        throw error;
      }

      console.log(data);
      return null;
      //return data as unknown as Tenant;
    } catch (error) {
      console.error("Failed to update tenant:", (error as Error).message);
      return null;
    }
  },
};

export default tenantService;
