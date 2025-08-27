import { supabase } from "@/lib/supabase.ts";
import { tenantStore } from "@/stores/tenant.ts";

export interface LibraryWithdraw {
  id: number;
  library_game_id: number;
  tenant_id: string;
  event_id: number;
  started_at: number;
  ended_at: number;
  user_id: string;
  created_by: string;
}

export const libraryWithdrawService = {
  async get(): Promise<Array<LibraryWithdraw>> {
    try {
      const result = await supabase
        .from("library_withdraws")
        .select("*")
        .eq("tenant_id", tenantStore.value?.id)
        .eq("edition_id", tenantStore.value?.current_event);

      console.log(result.data);
      return result.data as LibraryWithdraw[];
    } catch (error) {
      console.error((error as Error).message);
      return [];
    }
  },

  async post(libraryGameId: number, userId: string): Promise<void> {
    const { error } = await supabase.from("library_withdraws").insert({
      tenant_id: tenantStore.value?.id,
      edition_id: tenantStore.value?.current_event,
      library_game_id: libraryGameId,
      started_at: new Date().toISOString(),
      user_id: userId,
    });

    if (error) {
      throw new Error(`Failed to create withdraw: ${error.message}`);
    }
  },

  async returnGame(libraryGameId: number): Promise<void> {
    // Update the active withdraw and return the updated record in a single operation
    const { data, error } = await supabase
      .from("library_withdraws")
      .update({
        ended_at: new Date().toISOString(),
      })
      .eq("library_game_id", libraryGameId)
      .eq("tenant_id", tenantStore.value?.id)
      .eq("edition_id", tenantStore.value?.current_event)
      .is("ended_at", null);

    if (error) {
      throw new Error(`Failed to return game: ${error.message}`);
    }
  },

  async getByLibraryGameId(
    libraryGameId: number
  ): Promise<Array<LibraryWithdraw>> {
    try {
      const result = await supabase
        .from("library_withdraws")
        .select("*")
        .eq("library_game_id", libraryGameId)
        .eq("tenant_id", tenantStore.value?.id)
        .eq("edition_id", tenantStore.value?.current_event)
        .order("started_at", { ascending: false });

      return result.data as LibraryWithdraw[];
    } catch (error) {
      console.error(
        "Error fetching withdraws by library game:",
        (error as Error).message
      );
      return [];
    }
  },

  async getActiveWithdraws(): Promise<Array<LibraryWithdraw>> {
    try {
      const result = await supabase
        .from("library_withdraws")
        .select("*")
        .eq("tenant_id", tenantStore.value?.id)
        .eq("edition_id", tenantStore.value?.current_event)
        .is("ended_at", null)
        .order("started_at", { ascending: false });

      return result.data as LibraryWithdraw[];
    } catch (error) {
      console.error(
        "Error fetching active withdraws:",
        (error as Error).message
      );
      return [];
    }
  },
} as const;

// Provide proper default export
export default libraryWithdrawService;
