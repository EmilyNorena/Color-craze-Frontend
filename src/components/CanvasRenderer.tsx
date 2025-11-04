import React, { useEffect, useMemo, useRef } from "react";
import avatarYellow from "../assets/avatar1.png";
import avatarRed from "../assets/avatar2.png";
import avatarPurple from "../assets/avatar3.png";
import avatarGreen from "../assets/avatar4.png";
import type { Player } from "../types/player";

interface CanvasRendererProps {
  grid: string[][];
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

      // Dibujar celdas del grid
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const colorKey = grid?.[r]?.[c] ?? "WHITE";
          const color = colorMap[colorKey] || "#e0e0e0";
          ctx.fillStyle = color;
          ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);

          ctx.strokeStyle = "#ccc";
          ctx.strokeRect(c * blockSize, r * blockSize, blockSize, blockSize);
        }
      }

      // Dibujar jugadores
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
          // fallback por si no ha cargado la imagen
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
