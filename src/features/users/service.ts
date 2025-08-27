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
  async search(query: string): Promise<User[]> {
    const result = await supabase.functions.invoke(`users`, {
      method: "POST",
      body: {
        query: query,
      },
    });
    return result.data as User[];
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
