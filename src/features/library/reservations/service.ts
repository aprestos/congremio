import { supabase } from '@/lib/supabase.ts'
import { editionStore } from '@/stores/edition'
import { tenantStore } from '@/stores/tenant.ts'
import type { LibraryGame } from '@/features/library/game.model.ts'
import logger from '@/lib/logger.ts'
import { DateTime } from 'luxon'

export interface LibraryReservation {
  tenant_id: string
  edition_id: string
  id: number
  library_game: Partial<LibraryGame>
  display_id: number
  user_id: string
  expires_at: string
  status: string
}

type ReservationUpdateCallback = (reservations: LibraryReservation[]) => void

export const libraryReservationService = {
  async getByDisplayId(
    displayId: string,
  ): Promise<LibraryReservation | undefined> {
    const now = DateTime.now().minus({ minute: 1 }).toISO()
    const { data, error } = await supabase
      .from('library_reservations')
      .select(
        'id,display_id,user_id,expires_at,library_game:library_games(id,game:games(name,year,image))',
      )
      .eq('tenant_id', tenantStore.value?.id)
      .eq('edition_id', editionStore.value?.id)
      .eq('status', 'active')
      .eq('display_id', displayId)
      .gte('expires_at', now)
      .single()

    if (error) {
      logger.error('Failed to get reservation by id', { error })
      throw new Error('Unable to fetch reservations')
    }

    return data as unknown as LibraryReservation
  },

  async get(userId: string): Promise<Array<LibraryReservation>> {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('library_reservations')
      .select(
        'id,display_id,expires_at,user_id,library_game:library_games(game:games(name,year,image))',
      )
      .eq('tenant_id', tenantStore.value?.id)
      .eq('edition_id', editionStore.value?.id)
      .eq('user_id', userId)
      .eq('status', 'active')
      .gt('expires_at', now)

    if (error) {
      logger.error('Failed to get reservation by id', { error })
      throw new Error('Unable to fetch reservations')
    }

    return data as unknown as LibraryReservation[]
  },

  async post(libraryGameId: number): Promise<void> {
    const { error } = await supabase.functions.invoke('library-reservations', {
      method: 'POST',
      body: {
        library_game_id: libraryGameId,
        tenant_id: tenantStore.value?.id,
        edition_id: editionStore.value?.id,
      },
    })

    if (error) {
      logger.error('Error creating reservation', { error })
      throw new Error('Failed to reserve game')
    }
  },

  subscribeToUpdates(
    userId: string,
    onUpdate: ReservationUpdateCallback,
  ): () => void {
    // Initial load using async/await
    const initializeData = async (): Promise<void> => {
      const reservations = await this.get(userId)
      onUpdate(reservations)
    }

    // Call the async function
    void initializeData()

    const handleDatabaseChange = (): void => {
      // Fetch fresh data and update if changed
      void this.get(userId).then((freshReservations) => {
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
