import { supabase } from "@/lib/supabase";
import type { Event } from "./event.model";

const EditionService = {
  async getById(eventId: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from("editions")
      .select("*")
      .eq("id", eventId)
      .single();
    if (error) throw error;
    return data;
  },
};

export default EditionService;
