import type { Game } from "@/features/external-game/model.ts";
import type { GameLocation } from "@/features/locations/model.ts";

export interface LibraryGame {
  id: number;
  owner: string;
  notes: string;
  event_id: number;
  location?: GameLocation;
  game: Game;
  status: "available" | "reserved" | "not-available" | "withdrawn";
}
