import type { ColorStatus } from "./colorStatus";

export interface PlayerUpdate {
  playerId: string;
  color: ColorStatus;
  newScore: number;
}