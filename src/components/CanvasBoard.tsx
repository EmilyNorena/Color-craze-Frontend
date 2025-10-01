// CanvasBoard.tsx (versión refactorizada)
import { useMemo } from 'react';
import { generatePlatforms } from '../contexts/platformConfig';
import { usePaintableGrid } from '../hooks/usePaintableGrid';
import CanvasRenderer from '../components/CanvasRenderer';
import StatsPanel from '../components/StatsPanel'; // Componente separado para estadísticas

interface CanvasBoardProps {
  rows?: number;
  cols?: number;
  blockSize?: number;
}

const CanvasBoard = ({ rows = 15, cols = 31, blockSize = 40 }: CanvasBoardProps) => {
  const playerColors = useMemo(() => ["#ff4d4d", "#4d94ff", "#4dff4d", "#ffd24d"], []);
  
  const platforms = useMemo(() => 
    generatePlatforms(rows, cols), [rows, cols]
  );

  const {
    paintedCells,
    paintCell,
    clearGrid,
    getStats
  } = usePaintableGrid(platforms, playerColors);

  const handleCellClick = (row: number, col: number) => {
    if (platforms.some(p => p.row === row && p.col === col)) {
      paintCell(row, col);
    }
  };

  const stats = getStats();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      <StatsPanel stats={stats} onClear={clearGrid} />
      
      <CanvasRenderer
        platforms={platforms}
        paintedCells={paintedCells}
        blockSize={blockSize}
        cols={cols}
        rows={rows}
        onCellClick={handleCellClick}
      />
    </div>
  );
};

export default CanvasBoard;