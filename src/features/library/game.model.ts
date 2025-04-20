import type { ExternalGame } from '@/features/external-game/model.ts'

export interface Game {
  id: number
  owner_id: string
  notes: string
  event_id: number
  game: ExternalGame
}
