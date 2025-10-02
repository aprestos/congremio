import type { Game } from '@/features/external-game/model.ts'
import { supabase } from '@/lib/supabase.ts'

export const gameService = {
  async get(id: string): Promise<Game> {
    const result = await supabase.functions.invoke(`games/${id}`, {
      method: 'GET',
    })
    return result.data as Game
  },

  async search(query: string): Promise<Game[]> {
    const result = await supabase.functions.invoke<{
      results: Game[]
    }>(`games?query=${query}`, {
      method: 'GET',
    })
    return result.data?.results ?? []
  },
} as const

export default gameService
