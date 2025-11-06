import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import CanvasBoard from "../components/CanvasBoard";
import StatsPanel from "../components/StatsPanel";
import { getBoardState} from "../services/boardService";
import { useWebSocketGame } from "../hooks/useWebSocketGame";
import type { MoveResult } from "../types/board/moveResult";
import type { BoardData } from "../types/board/boardData";

export const BoardPage = () => {
  const { gameId } = useParams<{ gameId: string }>();

  const [playerId] = useState<string | null>(sessionStorage.getItem("correlationId"));
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [stats, setStats] = useState<{
    totalPaintable: number;
    paintedCount: number;
    remaining: number;
  } | null>(null);
  const [clearGridFn, setClearGridFn] = useState<(() => void) | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastMoveResult, setLastMoveResult] = useState<MoveResult | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      if (!gameId) return;
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(true);
        const data = await getBoardState(gameId);
        setBoardData(data);
      } catch (error) {
        console.error("Error cargando el estado del tablero:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [gameId]);

  const handleStatsChange = useCallback(
    (
      updatedStats: { totalPaintable: number; paintedCount: number; remaining: number },
      clearGrid: () => void
    ) => {
      setStats(updatedStats);
      setClearGridFn(() => clearGrid);
    },
    []
  );

  const { connected, sendMove, moveResults } = useWebSocketGame(gameId!, playerId!);

  useEffect(() => {
    if (moveResults.length > 0) {
      setLastMoveResult(moveResults[moveResults.length - 1]);
    }
  }, [moveResults]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!connected) return;
      let direction: string | null = null;
      switch (e.key) {
        case "w":
        case "ArrowUp":
          direction = "UP";
          break;
        case "s":
        case "ArrowDown":
          direction = "DOWN";
          break;
        case "a":
        case "ArrowLeft":
          direction = "LEFT";
          break;
        case "d":
        case "ArrowRight":
          direction = "RIGHT";
          break;
      }
      if (direction) sendMove(direction);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [connected, sendMove]);

  if (!playerId)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>No se encontró el usuario.</p>
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Cargando tablero...</p>
      </div>
    );

  if (!boardData)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Error al cargar el tablero o no existe.</p>
      </div>
    );

  const { grid, players } = boardData;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden p-8">
      {stats && (
        <div className="mb-6 w-full max-w-3xl">
          <StatsPanel stats={stats} onClear={clearGridFn || (() => {})} />
        </div>
      )}
      <div className="relative bg-gray-800 border-4 border-sky-500 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] p-6 flex items-center justify-center">
        <CanvasBoard
          rows={15}
          cols={31}
          blockSize={40}
          onStatsChange={handleStatsChange}
          initialGrid={grid}
          initialPlayers={Object.values(players)}
          moveResult={lastMoveResult ?? undefined}
        />
      </div>
    </div>
  );
};

export default BoardPage;
