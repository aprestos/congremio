import type { LibraryGame } from '@/features/library/game.model.ts'
import { supabase } from '@/lib/supabase.ts'
import { eventStore } from '@/stores/event'
import { tenantStore } from '@/stores/tenant.ts'

type GameUpdateCallback = (games: LibraryGame[]) => void

export const libraryService = {
  async get(): Promise<Array<LibraryGame>> {
    try {
      const result = await supabase
        .from('library_games')
        .select(
          'id,owner,notes,game:games(id,name,image,year,min_playtime,max_playtime,min_players,max_players),event_id,status',
        )
        .eq('tenant_id', tenantStore.value?.id)
        .eq('event_id', eventStore.value?.id)
      return result.data as unknown as LibraryGame[]
    } catch (error) {
      console.error((error as Error).message)
      return []
    }
  },

  async post(
    gameId: number,
    locationId: number,
    owner: string,
    notes?: string,
  ): Promise<void> {
    const { error } = await supabase.from('library_games').insert({
      tenant_id: tenantStore.value?.id,
      event_id: eventStore.value?.id,
      game_id: gameId,
      location_id: locationId,
      owner: owner,
      notes: notes || undefined,
    })

    if (error) {
      throw new Error(`Failed to create library game: ${error.message}`)
    }
  },

  subscribeToUpdates(onUpdate: GameUpdateCallback): () => void {
    // Initial load using async/await
    const initializeData = async (): Promise<void> => {
      const games = await this.get()
      onUpdate(games)
    }

    // Call the async function
    void initializeData()

    const handleDatabaseChange = (): void => {
      // Fetch fresh data and update if changed
      void this.get().then((freshGames) => {
        onUpdate(freshGames)
      })
    }

    // Listen to changes on library_games table
    const libraryGamesChannel = supabase
      .channel('library-games-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'library_games',
        },
        handleDatabaseChange,
      )
      .subscribe()

    // Return cleanup function to remove both channels
    return () => {
      void supabase.removeChannel(libraryGamesChannel)
    }
  },

  async search(query: string): Promise<Array<LibraryGame>> {
    try {
      const result = await supabase
        .from('library_games')
        .select('*')
        .eq('tenant_id', tenantStore.value?.id)
        .eq('event_id', eventStore.value?.id)
        .or(
          `game_name.ilike.%${query}%,owner.ilike.%${query}%,notes.ilike.%${query}%`,
        )

      console.log('Search results:', result.data)
      return result.data as LibraryGame[]
    } catch (error) {
      console.error('Search error:', (error as Error).message)
      return []
    }
  },
} as const

// Provide proper default export
export default libraryService
