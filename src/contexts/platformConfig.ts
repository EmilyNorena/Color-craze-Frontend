// platformConfig.ts
import type { Position } from "../types/board/Position";
export const generatePlatforms = (rows: number, cols: number): Position[] => {
  const platforms: Position[] = [
    { row: 9, col: 1 }, { row: 9, col: 29 }, { row: 10, col: 15 }, 
    { row: 11, col: 16 }, { row: 11, col: 14 }, { row: 12, col: 13 }, 
    { row: 12, col: 17 }
  ];

  for (let i = 0; i < cols; i++) {
    platforms.push({ row: 0, col: i }, { row: rows - 1, col: i });
    
    if (i >= 8 && i <= 22) platforms.push({ row: 3, col: i });
    if ((i >= 3 && i < 6) || (i > 24 && i <= 27)) platforms.push({ row: 6, col: i });
    if ((i >= 6 && i <= 9) || (i >= 21 && i <= 24)) platforms.push({ row: 7, col: i });
    if ((i >= 4 && i <= 8) || (i >= 22 && i <= 26)) platforms.push({ row: 11, col: i });
  }

  for (let i = 0; i < rows; i++) {
    if (i !== 9) {
      platforms.push({ row: i, col: 0 }, { row: i, col: cols - 1 });
    }
  }

  return platforms;
};