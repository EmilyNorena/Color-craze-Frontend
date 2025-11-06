import type { PlatformUpdate } from "./platformUpdate";
import type { PlayerUpdate } from "./playerUpdate";

export interface MoveResult {
  playerId: string;
  newRow: number;
  newCol: number;
  platforms: PlatformUpdate[];
  affectedPlayers: PlayerUpdate[];
  success: boolean;
}