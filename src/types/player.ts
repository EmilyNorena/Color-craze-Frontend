export interface Player {
  id: string;
  row: number;
  col: number;
  color: string;
  avatar?: string;
  alive?: boolean;
}
