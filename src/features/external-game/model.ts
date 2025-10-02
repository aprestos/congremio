export type Game = GameSummary & {
  min_players: number
  max_players: number
  min_playtime: number
  max_playtime: number
  min_age: string
  best_at: string
  recommended_at: string
}

export interface GameSummary {
  id: number
  externalId: string
  bggId: string
  name: string
  image: string
  year: string
}

export interface ExternalGameSearchResult {
  id: string
}
