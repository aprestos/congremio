import { supabase } from '@/lib/supabase.ts'
import { eventStore } from '@/stores/edition'
import { tenantStore } from '@/stores/tenant.ts'
import logger from '@/lib/logger.ts'

export interface LibraryWithdraw {
  id: number
  library_game_id: number
  tenant_id: string
  event_id: number
  started_at: number
  ended_at: number
  user_id: string
  created_by: string
}

export const libraryWithdrawService = {
  async get(): Promise<Array<LibraryWithdraw>> {
    try {
      const result = await supabase
        .from('library_withdraws')
        .select('*')
        .eq('tenant_id', tenantStore.value?.id)
        .eq('edition_id', eventStore.value?.id)

      return result.data as LibraryWithdraw[]
    } catch (error) {
      logger.error('Error on libraryWithdrawService.get()', { error })
      return []
    }
  },

  async create(libraryGameId: number, userId: string): Promise<void> {
    const { error } = await supabase.from('library_withdraws').insert({
      tenant_id: tenantStore.value?.id,
      edition_id: eventStore.value?.id,
      library_game_id: libraryGameId,
      started_at: new Date().toISOString(),
      user_id: userId,
    })

    if (error) {
      throw new Error(`Failed to create withdraw: ${error.message}`)
    }
  },

  async returnGame(libraryGameId: number): Promise<void> {
    // Update the active withdraw and return the updated record in a single operation
    const { error } = await supabase
      .from('library_withdraws')
      .update({
        ended_at: new Date().toISOString(),
      })
      .eq('library_game_id', libraryGameId)
      .eq('tenant_id', tenantStore.value?.id)
      .eq('edition_id', eventStore.value?.id)
      .is('ended_at', null)

    if (error) {
      throw new Error(`Failed to return game: ${error.message}`)
    }
  },

  async getActiveByLibraryGameId(
    libraryGameId: number,
  ): Promise<LibraryWithdraw | null> {
    try {
      const result = await supabase
        .from('library_withdraws')
        .select('*')
        .eq('library_game_id', libraryGameId)
        .eq('tenant_id', tenantStore.value?.id)
        .eq('edition_id', eventStore.value?.id)
        .is('ended_at', null)
        .order('started_at', { ascending: false })
        .single<LibraryWithdraw>()

      return result.data
    } catch (error) {
      logger.error('Error fetching withdraws by library game:', { error })
      return null
    }
  },

  async getActiveWithdraws(): Promise<Array<LibraryWithdraw>> {
    try {
      const result = await supabase
        .from('library_withdraws')
        .select('*')
        .eq('tenant_id', tenantStore.value?.id)
        .eq('edition_id', eventStore.value?.id)
        .is('ended_at', null)
        .order('started_at', { ascending: false })

      return result.data as LibraryWithdraw[]
    } catch (error) {
      logger.error('Error fetching active withdraws:', { error })
      return []
    }
  },

  async countByGame(libraryGameId: number): Promise<number> {
    try {
      const result = await supabase
        .from('library_withdraws')
        .select('*', { count: 'exact', head: true })
        .eq('library_game_id', libraryGameId)
        .eq('tenant_id', tenantStore.value?.id)
        .eq('edition_id', eventStore.value?.id)

      return result.count || 0
    } catch (error) {
      logger.error('Error counting withdraws by library game:', { error })
      return 0
    }
  },
} as const

// Provide proper default export
export default libraryWithdrawService
