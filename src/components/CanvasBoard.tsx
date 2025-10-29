import { useMemo, useEffect, useCallback } from "react";
import { generatePlatforms } from "../contexts/platformConfig";
import { usePaintableGrid } from "../hooks/usePaintableGrid";
import CanvasRenderer from "../components/CanvasRenderer";

interface CanvasBoardProps {
  rows?: number;
  cols?: number;
  blockSize?: number;
  onStatsChange?: (
    stats: {
      totalPaintable: number;
      paintedCount: number;
      remaining: number;
    },
    clearGrid: () => void
  ) => void;
}

const CanvasBoard = ({
  rows = 15,
  cols = 31,
  blockSize = 40,
  onStatsChange,
}: CanvasBoardProps) => {
  const playerColors = useMemo(
    () => ["#ff4d4d", "#4d94ff", "#4dff4d", "#ffd24d"],
    []
  );

  const platforms = useMemo(() => generatePlatforms(rows, cols), [rows, cols]);

  const { paintedCells, paintCell, clearGrid, getStats } = usePaintableGrid(
    platforms,
    playerColors
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (platforms.some((p) => p.row === row && p.col === col)) {
        paintCell(row, col);
      }
    },
    [paintCell, platforms]
  );

  useEffect(() => {
    const stats = getStats();
    if (onStatsChange) {
      onStatsChange(stats, clearGrid);
    }
  }, [paintedCells, getStats, clearGrid, onStatsChange]);

  return (
    <CanvasRenderer
      platforms={platforms}
      paintedCells={paintedCells}
      blockSize={blockSize}
      cols={cols}
      rows={rows}
      onCellClick={handleCellClick}
    />
  );
};

export default CanvasBoard;
