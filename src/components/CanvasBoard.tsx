import React, { useEffect, useMemo } from "react";
import CanvasRenderer from "../components/CanvasRenderer";
import type { Player } from "../types/player";

interface CanvasBoardProps {
  grid: string[][]; // matriz del backend con los colores
  players: Player[]; // jugadores con posiciones y color
  rows?: number;
  cols?: number;
  blockSize?: number;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({
  grid,
  players,
  rows = 15,
  cols = 31,
  blockSize = 40,
}) => {
  const colorMap = useMemo(
    () => ({
      PLATFORM: "#555", 
      WHITE: "#e0e0e0",
      RED: "#ff4d4d",
      BLUE: "#4d94ff",
      GREEN: "#4dff4d",
      YELLOW: "#ffd24d",
    }),
    []
  );

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
