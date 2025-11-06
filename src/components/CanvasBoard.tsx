import React, { useEffect, useMemo, useState, useRef } from "react";
import CanvasRenderer from "./CanvasRenderer";
import type { Player } from "../types/board/player";
import type { MoveResult } from "../types/board/moveResult";
import type { PlatformUpdate } from "../types/board/platformUpdate";
import type { Cell } from "../types/board/cell";

export interface CanvasBoardProps {
  initialGrid?: Cell[][];
  initialPlayers?: Player[];
  rows?: number;
  cols?: number;
  blockSize?: number;
  onStatsChange?: (
    stats: { totalPaintable: number; paintedCount: number; remaining: number },
    clearGrid: () => void
  ) => void;
  moveResult?: MoveResult;
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
  const [grid, setGrid] = useState<Cell[][]>(() => {
    if (initialGrid.length > 0) return initialGrid;
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ type: "BOX", color: "WHITE" }))
    );
  });

  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const movingPlayersRef = useRef<
    Record<
      string,
      { fromRow: number; fromCol: number; toRow: number; toCol: number; startTime: number }
    >
  >({});

  const colorMap = useMemo(
    () => ({
      PLATFORM: "#555555",
      WHITE: "#e0e0e0",
      RED: "#ff4d4d",
      PURPLE: "#6a1899ff",
      GREEN: "#4dff4d",
      YELLOW: "#ffd24d",
    }),
    []
  );

  useEffect(() => {
    if (onStatsChange) {
      const total = rows * cols;
      const painted = grid.flat().filter((c) => c.color !== "WHITE").length;
      const remaining = total - painted;

      const clearGrid = () => {
        setGrid(
          Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ({ type: "BOX", color: "WHITE" }))
          )
        );
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
        if (p.id === moveResult.playerId) {
          const affected = moveResult.affectedPlayers.find((ap) => ap.playerId === p.id);
          movingPlayersRef.current[p.id] = {
            fromRow: p.row,
            fromCol: p.col,
            toRow: moveResult.newRow,
            toCol: moveResult.newCol,
            startTime: performance.now(),
          };
          return {
            ...p,
            row: moveResult.newRow,
            col: moveResult.newCol,
            color: affected ? affected.color : p.color,
          };
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
      movingPlayersRef={movingPlayersRef}
    />
  );
};

export default CanvasBoard;
