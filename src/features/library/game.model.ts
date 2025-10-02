import type { Game } from '@/features/external-game/model.ts'
import type { GameLocation } from '@/features/locations/model.ts'

export enum LibraryGameStatus {
  available = 'available',
  reserved = 'reserved',
  notAvailable = 'not-available',
  withdrawn = 'withdrawn',
}

export interface LibraryGame {
  id: number
  owner: string
  notes: string
  event_id: number
  location?: GameLocation
  game: Game
  status: LibraryGameStatus
  reserved_until?: string
}

export const getStatus = (game: LibraryGame | null): string => {
  if (!game) return ''

  if (game.status === LibraryGameStatus.reserved) {
    if (
      game.reserved_until &&
      new Date(game.reserved_until).getTime() > new Date().getTime()
    ) {
      return 'reserved'
    } else {
      return 'available'
    }
  } else {
    return game.status
  }
}

export const getStatusColor = (game: LibraryGame): string => {
  const status = getStatus(game)

  switch (status) {
    case 'withdrawn':
      return 'from-amber-700'
    case 'reserved':
      return 'from-blue-700'
    case 'not-available':
      return 'from-red-700'
    default:
      return ''
  }
}

export const getStatusLabel = (game: LibraryGame): string => {
  const status = getStatus(game)

  switch (status) {
    case 'withdrawn':
      return 'Withdrawn'
    case 'reserved':
      return 'Reserved'
    case 'not-available':
      return 'Not Available'
    default:
      return ''
  }
}
