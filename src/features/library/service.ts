import type { LibraryGame } from '@/features/library/game.model.ts'
import { supabase } from '@/lib/supabase.ts'
import { eventStore } from '@/stores/edition'
import { tenantStore } from '@/stores/tenant.ts'

export interface FilterOptions {
  searchQuery?: string
  selectedFilters?: Record<string, string[]>
}

type GameUpdateCallback = (games: LibraryGame[]) => void

export const libraryService = {
  async count(): Promise<number> {
    const result = await supabase
      .from('library_games')
      .select('*', { count: 'exact', head: true })
    return result.count || 0
  },
  async get(): Promise<Array<LibraryGame>> {
    try {
      const result = await supabase
        .from('library_games')
        .select(
          'id,owner,notes,game:games(*),location:locations(id,name),edition_id,status,reserved_until',
        )
        .eq('tenant_id', tenantStore.value?.id)
        .eq('edition_id', eventStore.value?.id)
      return result.data as unknown as LibraryGame[]
    } catch (error) {
      console.error((error as Error).message)
      return []
    }
  },

  async getById(id: string): Promise<LibraryGame | null> {
    try {
      const result = await supabase
        .from('library_games')
        .select('id,owner,notes,game:games(*),edition_id,status,reserved_until')
        .eq('id', id)
        .single()
      return result.data as unknown as LibraryGame
    } catch (error) {
      console.error((error as Error).message)
      return null
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
      edition_id: eventStore.value?.id,
      game_id: gameId,
      location_id: locationId,
      status: 'not-available',
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

  applyFilters(games: LibraryGame[], filters: FilterOptions): LibraryGame[] {
    let filtered = games

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (game) =>
          game.game.name.toLowerCase().includes(query) ||
          game.owner.toLowerCase().includes(query) ||
          game.notes?.toLowerCase().includes(query),
      )
    }

    // Apply selected filters
    if (filters.selectedFilters) {
      // Players filter
      if (filters.selectedFilters.players?.length) {
        const playerFilters = filters.selectedFilters.players
        filtered = filtered.filter((game) => {
          const minPlayers = game.game.min_players
          const maxPlayers = game.game.max_players
          return playerFilters.some((playerCount) => {
            if (playerCount === '10+') {
              return minPlayers <= 10 && maxPlayers >= 10
            }
            const count = parseInt(playerCount)
            return count >= minPlayers && count <= maxPlayers
          })
        })
      }

      // Playtime filter
      if (filters.selectedFilters.playtime?.length) {
        const playtimeFilters = filters.selectedFilters.playtime
        filtered = filtered.filter((game) => {
          const maxPlaytime = game.game.max_playtime
          return playtimeFilters.some((time) => {
            const minutes = parseInt(time)
            return maxPlaytime <= minutes
          })
        })
      }

      // Tags/Category filter - implement category-specific filtering logic
      if (filters.selectedFilters.tags?.length) {
        const tagFilters = filters.selectedFilters.tags
        filtered = filtered.filter((game) => {
          return tagFilters.some((tag) => {
            switch (tag) {
              case 'New arrivals':
                // Filter games from current year
                return parseInt(game.game.year) === new Date().getFullYear()
              case 'Family':
                // Filter family-friendly games (suitable for all ages, typically min_age <= 8)
                return (
                  parseInt(game.game.min_age) <= 8 && game.game.max_players >= 3
                )
              case 'Classics':
                // Filter classic games (older than 10 years)
                return parseInt(game.game.year) <= new Date().getFullYear() - 10
              case 'Most played':
                // This would require play count data - for now return games with good player count range
                return game.game.min_players <= 4 && game.game.max_players >= 4
              default:
                return false
            }
          })
        })
      }
    }

    return filtered
  },

  async search(query: string): Promise<Array<LibraryGame>> {
    try {
      const result = await supabase
        .from('library_games')
        .select('*')
        .eq('tenant_id', tenantStore.value?.id)
        .eq('edition_id', eventStore.value?.id)
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

  async updateGame(
    id: number,
    update: Partial<LibraryGame> & { location_id?: number },
  ) {
    await supabase.from('library_games').update(update).eq('id', id)
  },

  async deleteGame(libraryGameId: number): Promise<void> {
    await supabase.from('library_games').delete().eq('id', libraryGameId)
  },
} as const

// Provide proper default export
export default libraryService
