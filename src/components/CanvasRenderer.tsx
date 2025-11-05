import React, { useEffect, useMemo, useRef } from "react";
import avatarYellow from "../assets/avatar1.png";
import avatarRed from "../assets/avatar2.png";
import avatarPurple from "../assets/avatar3.png";
import avatarGreen from "../assets/avatar4.png";
import type { Player } from "../types/player";

interface BoxCell {
  type: "BOX" | "PLATFORM" | "PLAYER";
  color: string;
}

interface CanvasRendererProps {
  grid: BoxCell[][];
  players: Player[];
  colorMap: Record<string, string>;
  blockSize: number;
  cols: number;
  rows: number;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  grid,
  players,
  colorMap,
  blockSize,
  cols,
  rows,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // precargar avatares
  const avatars = useMemo(() => ({
    YELLOW: new Image(),
    RED: new Image(),
    PURPLE: new Image(),
    GREEN: new Image(),
  }), []);

  useEffect(() => {
    avatars.YELLOW.src = avatarYellow;
    avatars.RED.src = avatarRed;
    avatars.PURPLE.src = avatarPurple;
    avatars.GREEN.src = avatarGreen;
  }, [avatars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawBoard = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid?.[r]?.[c];
          if (!cell) continue;

          let fillColor = "#e0e0e0";

          switch (cell.type.toUpperCase()) {
            case "BOX":
              fillColor = "transparent";
              break;

            case "PLATFORM":
              fillColor =
                cell.color === "WHITE"
                  ? colorMap["WHITE"]
                  : colorMap[cell.color] || colorMap["WHITE"];
              break;

            case "PLAYER":
              fillColor = "transparent";
              break;

            default:
              fillColor = "transparent";
          }

          ctx.fillStyle = fillColor;
          ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
        }
      }

      players.forEach((player) => {
        const img = avatars[player.color as keyof typeof avatars];
        if (img && img.complete) {
          ctx.drawImage(
            img,
            player.col * blockSize,
            player.row * blockSize,
            blockSize,
            blockSize
          );
        } else {
          ctx.fillStyle = colorMap[player.color] || "black";
          ctx.beginPath();
          ctx.arc(
            player.col * blockSize + blockSize / 2,
            player.row * blockSize + blockSize / 2,
            blockSize / 3,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      });
    };

    drawBoard();
  }, [grid, players, blockSize, rows, cols, colorMap, avatars]);

  return (
    <canvas
      ref={canvasRef}
      width={cols * blockSize}
      height={rows * blockSize}
      style={{
        border: "2px solid #333",
        borderRadius: "8px",
        background: "transparent",
      }}
    />
  );
};

export default CanvasRenderer;
