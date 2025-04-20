import type { ExternalGame } from '@/features/external-game/model.ts'
import { supabase } from '@/lib/supabase.ts'

export default class ExternalGameService {
  static async get(id: string): Promise<ExternalGame[]> {
    const result = await supabase.functions.invoke(`get-or-create-game`, {
      method: 'POST',
      body: {
        external_id: id,
      },
    })
    return result.data as ExternalGame[]
  }

  static async search(query: string): Promise<ExternalGame[]> {
    const result = await supabase.functions.invoke(`boardgamegeek-api?query=${query}`, {
      method: 'GET',
    })
    return result.data as ExternalGame[]
  }
}
