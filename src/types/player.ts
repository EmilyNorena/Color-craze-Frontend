export interface Player {
  playerId: string;
  row: number;
  col: number;
  color: string;
  avatar?: string;
  alive?: boolean;
}
