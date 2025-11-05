export type Game = GameSummary & {
  min_players: number
  max_players: number
  min_playtime: number
  max_playtime: number
  min_age: number
  best_at: string
  recommended_at: string
  language_dependence?: string
}

export interface GameSummary {
  id: number
  external_id: string
  bgg_id: string
  name: string
  image: string
  year: string
}

export interface ExternalGameSearchResult {
  id: string
}
