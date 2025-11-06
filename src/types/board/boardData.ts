import type { Cell } from "./cell";
import type { Player } from "./player";

export interface BoardData {
  grid: Cell[][];
  players: Record<string, Player>;
}