// CanvasRenderer.tsx
import { useEffect, useRef } from "react";
import type { Position } from "../types/Position";
interface CanvasRendererProps {
  platforms: Position[];
  paintedCells: Record<string, string>;
  blockSize: number;
  cols: number;
  rows: number;
  onCellClick: (row: number, col: number) => void;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  platforms,
  paintedCells,
  blockSize,
  cols,
  rows,
  onCellClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawBoard = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      platforms.forEach(({ row, col }) => {
        const positionKey = `${row},${col}`;
        const color = paintedCells[positionKey];

        ctx.fillStyle = color || '#e0e0e0';
        ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);

        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = color ? 2 : 1;
        ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
      });
    };

    drawBoard();
  }, [platforms, paintedCells, blockSize]);

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
        border: '2px solid #333',
        background: 'transparent',
        borderRadius: '8px',
      }}
    />
  );
};

export default CanvasRenderer;
