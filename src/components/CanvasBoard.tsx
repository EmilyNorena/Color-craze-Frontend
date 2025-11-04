import React, { useEffect, useMemo, useState } from "react";
import CanvasRenderer from "../components/CanvasRenderer";
import type { Player } from "../types/player";

interface CanvasBoardProps {
  initialGrid?: any[][]; // matriz del backend con los colores o Box
  players?: Player[]; // jugadores con posiciones y color
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
  const [grid, setGrid] = useState<string[][]>(() => {
    if (initialGrid.length > 0) {
      return initialGrid.map((row) =>
        row.map((cell: any) =>
          typeof cell === "string"
            ? cell
            : cell.color || "WHITE" // si es objeto Box, tomamos cell.color
        )
      );
    }
    return Array.from({ length: rows }, () =>
      Array(cols).fill("WHITE")
    );
  });

  // 🔹 Mapa de colores que usarán el renderer y el canvas
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

  // 🔹 Simulación de stats o de clearGrid
  useEffect(() => {
    if (onStatsChange) {
      const total = rows * cols;
      const painted = grid.flat().filter((c) => c !== "WHITE").length;
      const remaining = total - painted;

      const clearGrid = () => {
        setGrid(Array.from({ length: rows }, () => Array(cols).fill("WHITE")));
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
