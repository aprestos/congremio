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
      const { data, error } = await supabase
        .from("tenants")
        .select()
        .eq("domain", domain)
        .single();

      if (error) {
        const { data, error } = await supabase.from("tenants").select();
        console.log(data);
        console.error((error as Error).message);
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
