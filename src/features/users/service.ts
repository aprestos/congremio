import type { Game } from "@/features/external-game/model.ts";
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const userService = {
  async search(query: string): Promise<Game> {
    const result = await supabase.functions.invoke(`users`, {
      method: "POST",
      body: {
        external_id: id,
      },
    });
    return result.data as Game;
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .schema("auth")
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },
};
