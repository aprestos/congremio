export interface Game {
  id: number;
  external_id: string;
  name: string;
  image: string;
  year: string;
  min_players: string;
  max_players: string;
  min_playtime: string;
  max_playtime: string;
  min_age: string;
  created_at: string;
}

export interface ExternalGameSearchResult {
  id: string;
}
