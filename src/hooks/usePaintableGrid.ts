// usePaintableGrid.ts
import { useState, useCallback } from 'react';
import type { Position } from "../types/Position";

export const usePaintableGrid = (platforms: Position[], playerColors: string[]) => {
  const [paintedCells, setPaintedCells] = useState<Record<string, string>>({});

  const getPositionKey = useCallback((row: number, col: number): string => {
    return `${row},${col}`;
  }, []);

  const paintCell = useCallback((row: number, col: number) => {
    const positionKey = getPositionKey(row, col);
    const newColor = playerColors[Math.floor(Math.random() * playerColors.length)];
    
    setPaintedCells(prev => ({ ...prev, [positionKey]: newColor }));
  }, [getPositionKey, playerColors]);

  const clearGrid = useCallback(() => {
    setPaintedCells({});
  }, []);

  const getStats = useCallback(() => {
    const totalPaintable = platforms.length;
    const paintedCount = Object.keys(paintedCells).length;
    const remaining = totalPaintable - paintedCount;
    return { totalPaintable, paintedCount, remaining };
  }, [platforms.length, paintedCells]);

  return {
    paintedCells,
    paintCell,
    clearGrid,
    getStats,
    getPositionKey
  };
};