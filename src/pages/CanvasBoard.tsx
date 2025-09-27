import { useEffect, useRef, useState } from "react";

interface CanvasBoardProps {
  rows?: number;
  cols?: number;
  blockSize?: number;
}

interface Position {
  row: number;
  col: number;
}

const CanvasBoard = ({ rows = 15, cols = 31, blockSize = 40 }: CanvasBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paintablePositions: Position[] = [
    { row: 9, col: 1 }, { row: 9, col: 29 }, { row: 10, col: 15 }, { row: 11, col: 16 },
    { row: 11, col: 14 }, { row: 12, col: 13 }, { row: 12, col: 17 }];

  for (let i = 0; i < cols; i++) {
    paintablePositions.push({ row: 0, col: i });
    paintablePositions.push({ row: rows - 1, col: i });
    if (i >= 8 && i <= 22){
      paintablePositions.push({ row: 3, col: i });
    } 
    if ((i >= 3 && i < 6) ||(i > 24 && i <= 27)){
      paintablePositions.push({ row: 6, col: i });
    } 
    if ((i >= 6 && i <= 9) ||(i >= 21 && i <= 24)){
      paintablePositions.push({ row: 7, col: i });
    }
    if ((i >= 4 && i <= 8) ||(i >= 22 && i <= 26)){
      paintablePositions.push({ row: 11, col: i });
    }
  }

  for (let i = 0; i < rows; i++) {
    if (i != 9){
      paintablePositions.push({ row: i, col: 0 });
      paintablePositions.push({ row: i, col: cols - 1 });
    }
  }


  const [paintedCells, setPaintedCells] = useState<Record<string, string>>({});

  const playerColors = ["#ff4d4d", "#4d94ff", "#4dff4d", "#ffd24d"];

  const isPaintable = (row: number, col: number): boolean => {
    return paintablePositions.some(pos => pos.row === row && pos.col === col);
  };

  const getPositionKey = (row: number, col: number): string => {
    return `${row}, ${col}`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawBoard = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      paintablePositions.forEach(({ row, col }) => {
        const positionKey = getPositionKey(row, col);
        const color = paintedCells[positionKey]; // Color o undefined si no está pintada

        ctx.fillStyle = color ? color : "#e0e0e0"; 
        ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);

        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = color ? 2 : 1;
        ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);

        ctx.lineWidth = 1;
      });
    };

    drawBoard();
  }, [paintedCells, blockSize]); 

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / blockSize);
    const row = Math.floor(y / blockSize);

    if (isPaintable(row, col)) {
      const positionKey = getPositionKey(row, col);
      const newColor = playerColors[Math.floor(Math.random() * playerColors.length)];

      setPaintedCells(prev => ({
        ...prev,
        [positionKey]: newColor
      }));
    }
  };

  const clearBoard = () => {
    setPaintedCells({});
  };

  const getStats = () => {
    const totalPaintable = paintablePositions.length;
    const paintedCount = Object.keys(paintedCells).length;
    const remaining = totalPaintable - paintedCount;

    return { totalPaintable, paintedCount, remaining };
  };

  const stats = getStats();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      <div style={{
        display: "flex",
        gap: "20px",
        padding: "10px",
        background: "#f5f5f5",
        borderRadius: "8px",
        fontSize: "14px"
      }}>
        <div>Total: <strong>{stats.totalPaintable}</strong></div>
        <div>Pintadas: <strong style={{ color: "#4d94ff" }}>{stats.paintedCount}</strong></div>
        <div>Restantes: <strong style={{ color: "#ff4d4d" }}>{stats.remaining}</strong></div>
      </div>

      <button
        onClick={clearBoard}
        style={{
          padding: "8px 16px",
          background: "#ff4d4d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Limpiar Tablero
      </button>

      <canvas
        ref={canvasRef}
        width={cols * blockSize}
        height={rows * blockSize}
        onClick={handleClick}
        style={{
          border: "2px solid #333",
          background: "transparent",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      />
    </div>
  );
};

export default CanvasBoard;