import type { GameLocation } from "@/features/locations/model.ts";
import { supabase } from "@/lib/supabase.ts";
import { eventStore } from "@/stores/event.ts";
import { tenantStore } from "@/stores/tenant.ts";

export const locationService = {
  async get(): Promise<Array<GameLocation>> {
    try {
      let query = supabase.from("locations").select();

      // Filter by tenant if available
      if (tenantStore.value?.id) {
        query = query.eq("tenant_id", tenantStore.value.id);
      }

      // Filter by event if available
      if (eventStore.value?.id) {
        query = query.eq("event_id", tenantStore.value?.current_event);
      }

      const result = await query;
      console.log(result.data);
      return result.data as unknown[] as GameLocation[];
    } catch (error) {
      console.error((error as Error).message);
      return [];
    }
  },
} as const;
