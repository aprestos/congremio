import type { Game } from '@/features/library/game.model.ts'
import { supabase } from '@/lib/supabase.ts'

export default class LibraryService {
  static async get(): Promise<Array<Game>> {
    try {
      const result = await supabase
        .from('library-games')
        .select(
          'id,owner_id,notes,game:games(id,name,image,year,min_playtime,max_playtime,min_players,max_players),event_id',
        )
      console.log(result.data)
      return result.data as unknown[] as Game[]
    } catch (error) {
      console.error((error as Error).message)
      return []
    }
  }
  static async post(
    game_id: number,
    location_id: number,
    owner: string,
    notes?: string,
  ): Promise<void> {
    const { error } = await supabase
      .from('library-games')
      .insert({ game_id, location_id, owner_id: null, notes: notes || undefined, event_id: 1 })
  }
}
