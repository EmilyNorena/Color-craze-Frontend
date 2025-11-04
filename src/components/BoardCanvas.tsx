import React, { useRef, useEffect } from "react";

interface Player {
  id: string;
  row: number;
  col: number;
  color: string; // por ejemplo "RED", "BLUE", etc.
}

interface BoardCanvasProps {
  grid: string[][]; // matriz de colores (ColorStatus)
  players: Player[];
  cellSize?: number; // tamaño de cada celda (por defecto 32px)
}

const colorMap: Record<string, string> = {
  WHITE: "#ffffff",
  RED: "#ff4d4d",
  BLUE: "#4d79ff",
  GREEN: "#4dff4d",
  YELLOW: "#ffe94d",
  PURPLE: "#b84dff",
  ORANGE: "#ff944d",
  BLACK: "#222222",
};

const BoardCanvas: React.FC<BoardCanvasProps> = ({ grid, players, cellSize = 32 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !grid) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rows = grid.length;
    const cols = grid[0].length;
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = colorMap[grid[r][c]] || "#cccccc";
        ctx.fillStyle = color;
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        ctx.strokeStyle = "#999";
        ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }

    // Dibujar los jugadores
    for (const player of players) {
      const px = player.col * cellSize + cellSize / 2;
      const py = player.row * cellSize + cellSize / 2;
      ctx.beginPath();
      ctx.arc(px, py, cellSize / 2.5, 0, Math.PI * 2);
      ctx.fillStyle = colorMap[player.color] || "#000";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.stroke();
    }
  }, [grid, players, cellSize]);

  return (
    <div className="flex justify-center items-center p-4">
      <canvas ref={canvasRef} className="rounded-lg shadow-lg border border-gray-400" />
    </div>
  );
};

export default BoardCanvas;
