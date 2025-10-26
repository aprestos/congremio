import { authService } from '@/features/auth/service'
import { supabase } from '@/lib/supabase.ts'
import { eventStore } from '@/stores/edition'
import { tenantStore } from '@/stores/tenant.ts'
import type { LibraryGame } from '@/features/library/game.model.ts'
import logger from '@/lib/logger.ts'

export interface LibraryReservation {
  tenant_id: string
  edition_id: string
  id: number
  library_game: Partial<LibraryGame>
  display_id: number
  user_id: string
  expires_at: string
}

type ReservationUpdateCallback = (reservations: LibraryReservation[]) => void

export const libraryReservationService = {
  async getByDisplayId(
    displayId: string,
  ): Promise<LibraryReservation | undefined> {
    try {
      const now = new Date().toISOString()
      const result = await supabase
        .from('library_reservations')
        .select(
          'id,display_id,user_id,expires_at,library_game:library_games(id,game:games(name))',
        )
        .eq('tenant_id', tenantStore.value?.id)
        .eq('edition_id', eventStore.value?.id)
        .eq('display_id', displayId)
        .gt('expires_at', now)
        .single()

      return result.data as unknown as LibraryReservation
    } catch (error) {
      console.error((error as Error).message)
      return undefined
    }
  },

  async get(): Promise<Array<LibraryReservation>> {
    const user = await authService.getUser()

    try {
      const now = new Date().toISOString()
      const result = await supabase
        .from('library_reservations')
        .select(
          'id,display_id,expires_at,user_id,library_game:library_games(game:games(name,year,image))',
        )
        .eq('tenant_id', tenantStore.value?.id)
        .eq('edition_id', eventStore.value?.id)
        .eq('user_id', user?.id)
        .gt('expires_at', now)

      return result.data as unknown as LibraryReservation[]
    } catch (error) {
      logger.error('Error fetching reservations', { error })
      return []
    }
  },

  async post(libraryGameId: number): Promise<void> {
    const { data, error } = await supabase.functions.invoke(
      'library-reservations',
      {
        method: 'POST',
        body: {
          library_game_id: libraryGameId,
          tenant_id: tenantStore.value?.id,
          edition_id: eventStore.value?.id,
        },
      },
    )

    if (data) {
      return
    } else {
      logger.error('Error creating reservation', error)
      throw new Error('Failed to reserve game')
    }
  },

  subscribeToUpdates(onUpdate: ReservationUpdateCallback): () => void {
    // Initial load using async/await
    const initializeData = async (): Promise<void> => {
      const reservations = await this.get()
      onUpdate(reservations)
    }

    // Call the async function
    void initializeData()

    const handleDatabaseChange = (): void => {
      // Fetch fresh data and update if changed
      void this.get().then((freshReservations) => {
        onUpdate(freshReservations)
      })
    }

    // Listen to changes on library_reservations table
    const libraryReservationsChannel = supabase
      .channel('library-reservations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'library_reservations',
        },
        handleDatabaseChange,
      )
      .subscribe()

    // Return cleanup function to remove channel
    return () => {
      void supabase.removeChannel(libraryReservationsChannel)
    }
  },
} as const

// Provide proper default export
export default libraryReservationService
