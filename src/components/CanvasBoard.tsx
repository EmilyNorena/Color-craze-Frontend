import React, { useEffect, useMemo, useState } from "react";
import CanvasRenderer from "./CanvasRenderer";
import type { Player } from "../types/player";
import type { MoveResult, PlatformUpdate, PlayerUpdate } from "../types/moveResult";

interface CanvasBoardProps {
  initialGrid?: any[][];
  initialPlayers?: Player[];
  rows?: number;
  cols?: number;
  blockSize?: number;
  onStatsChange?: (
    stats: { totalPaintable: number; paintedCount: number; remaining: number },
    clearGrid: () => void
  ) => void;
  moveResult?: MoveResult; // actualización en vivo
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({
  initialGrid = [],
  initialPlayers = [],
  rows = 15,
  cols = 31,
  blockSize = 40,
  onStatsChange,
  moveResult,
}) => {
  const [grid, setGrid] = useState(() => {
    if (initialGrid.length > 0) return initialGrid;
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ type: "BOX", color: "WHITE" }))
    );
  });

  const [players, setPlayers] = useState<Player[]>(initialPlayers);

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

  // Stats
  useEffect(() => {
    if (onStatsChange) {
      const total = rows * cols;
      const painted = grid.flat().filter((c: any) => c.color !== "WHITE").length;
      const remaining = total - painted;

      const clearGrid = () => {
        setGrid(Array.from({ length: rows }, () =>
          Array.from({ length: cols }, () => ({ type: "BOX", color: "WHITE" }))
        ));
      };

      onStatsChange({ totalPaintable: total, paintedCount: painted, remaining }, clearGrid);
    }
  }, [grid, onStatsChange, rows, cols]);

  useEffect(() => {
    if (!moveResult) return;

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
      moveResult.platforms.forEach((p: PlatformUpdate) => {
        if (newGrid[p.row] && newGrid[p.row][p.col]) {
          newGrid[p.row][p.col] = { type: "PLATFORM", color: p.color };
        }
      });
      return newGrid;
    });

    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => {
        const affected = moveResult.affectedPlayers.find((ap: PlayerUpdate) => ap.playerId === p.id);
        if (affected) {
          return { ...p, color: affected.color, row: moveResult.newRow, col: moveResult.newCol };
        }
        return p;
      })
    );
  }, [moveResult]);

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
