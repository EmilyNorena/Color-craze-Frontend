import React, { useEffect, useMemo, useState } from "react";
import CanvasRenderer from "../components/CanvasRenderer";
import type { Player } from "../types/player";

interface CanvasBoardProps {
  initialGrid?: any[][];
  players?: Player[];
  rows?: number;
  cols?: number;
  blockSize?: number;
  onStatsChange?: (
    stats: { totalPaintable: number; paintedCount: number; remaining: number },
    clearGrid: () => void
  ) => void;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({
  initialGrid = [],
  players = [],
  rows = 15,
  cols = 31,
  blockSize = 40,
  onStatsChange,
}) => {
  // Mantener objetos con { type, color }
  const [grid, setGrid] = useState(() => {
    if (initialGrid.length > 0) return initialGrid;
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ type: "Box", color: "WHITE" }))
    );
  });

  const colorMap = useMemo(
    () => ({
      PLATFORM: "#555555",
      WHITE: "#e0e0e0",
      RED: "#ff4d4d",
      BLUE: "#4d94ff",
      GREEN: "#4dff4d",
      YELLOW: "#ffd24d",
    }),
    []
  );

  useEffect(() => {
    if (onStatsChange) {
      const total = rows * cols;
      const painted = grid.flat().filter((c: any) => c.color !== "WHITE").length;
      const remaining = total - painted;

      const clearGrid = () => {
        setGrid(Array.from({ length: rows }, () =>
          Array.from({ length: cols }, () => ({ type: "Box", color: "WHITE" }))
        ));
      };

      onStatsChange({ totalPaintable: total, paintedCount: painted, remaining }, clearGrid);
    }
  }, [grid, onStatsChange, rows, cols]);

  return (
    <CanvasRenderer
      grid={grid}
      players={players}
      colorMap={colorMap}
      blockSize={blockSize}
      rows={rows}
      cols={cols}
    />
  );
};

export default CanvasBoard;
