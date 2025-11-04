import { useEffect, useRef } from "react";
import type { Position } from "../types/Position";

interface Player {
  id: string;
  row: number;
  col: number;
  color: string;
  avatar: string; // ruta al png
}

interface CanvasRendererProps {
  platforms: Position[];
  paintedCells: Record<string, string>;
  players: Player[];
  blockSize: number;
  cols: number;
  rows: number;
  onCellClick: (row: number, col: number) => void;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  platforms,
  paintedCells,
  players,
  blockSize,
  cols,
  rows,
  onCellClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pre-cargar imágenes de avatares
    const avatarImages: Record<string, HTMLImageElement> = {};
    players.forEach((player) => {
      const img = new Image();
      img.src = player.avatar;
      avatarImages[player.id] = img;
    });

    const drawBoard = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fondo de tablero
      ctx.fillStyle = "#1e1e1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar plataformas base
      platforms.forEach(({ row, col }) => {
        const x = col * blockSize;
        const y = row * blockSize;

        const key = `${row},${col}`;
        const paintedColor = paintedCells[key];

        ctx.fillStyle = paintedColor || "#2b2b2b";
        ctx.fillRect(x, y, blockSize, blockSize);

        // Bordes
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, blockSize, blockSize);
      });

      // Dibujar jugadores (avatares)
      players.forEach((player) => {
        const x = player.col * blockSize + blockSize * 0.1;
        const y = player.row * blockSize + blockSize * 0.1;
        const size = blockSize * 0.8;

        const img = avatarImages[player.id];
        if (img.complete) {
          ctx.drawImage(img, x, y, size, size);
        } else {
          img.onload = () => ctx.drawImage(img, x, y, size, size);
        }

        // Pequeño borde de color del jugador
        ctx.strokeStyle = player.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);
      });
    };

    drawBoard();
  }, [platforms, paintedCells, players, blockSize]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / blockSize);
    const row = Math.floor((e.clientY - rect.top) / blockSize);
    onCellClick(row, col);
  };

  return (
    <canvas
      ref={canvasRef}
      width={cols * blockSize}
      height={rows * blockSize}
      onClick={handleClick}
      style={{
        border: "2px solid #333",
        background: "#111",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        cursor: "pointer",
      }}
    />
  );
};

export default CanvasRenderer;
