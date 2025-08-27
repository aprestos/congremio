import type { Game } from "@/features/external-game/model.ts";
import { supabase } from "@/lib/supabase.ts";

export const gameService = {
  async get(id: string): Promise<Game> {
    const result = await supabase.functions.invoke(`get-or-create-game`, {
      method: "POST",
      body: {
        external_id: id,
      },
    });
    return result.data as Game;
  },

  async search(query: string): Promise<Game[]> {
    const result = await supabase.functions.invoke(
      `boardgamegeek-api?query=${query}`,
      {
        method: "GET",
      }
    );
    return result.data as Game[];
  },
} as const;

export default gameService;
