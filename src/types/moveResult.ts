export type ColorStatus = "WHITE" | "RED" | "PURPLE" | "GREEN" | "YELLOW" | "PLATFORM";

export interface PlatformUpdate {
  row: number;
  col: number;
  color: ColorStatus;
}

export interface PlayerUpdate {
  playerId: string;
  color: ColorStatus;
  newScore: number;
}

export interface MoveResult {
  playerId: string;
  newRow: number;
  newCol: number;
  platforms: PlatformUpdate[];
  affectedPlayers: PlayerUpdate[];
  success: boolean;
}