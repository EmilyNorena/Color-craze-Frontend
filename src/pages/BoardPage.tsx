import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import CanvasBoard from "../components/CanvasBoard";
import StatsPanel from "../components/StatsPanel";
import { getBoardState } from "../services/boardService"; // 👈 import del nuevo servicio

export const BoardPage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  console.log("📡 Llamando al backend con gameId:", gameId);

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [boardData, setBoardData] = useState<any | null>(null);
  const [stats, setStats] = useState<{
    totalPaintable: number;
    paintedCount: number;
    remaining: number;
  } | null>(null);
  const [clearGridFn, setClearGridFn] = useState<(() => void) | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener ID del jugador almacenado localmente
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) {
          setPlayerId(parsedUser.id);
        }
      } catch (error) {
        console.error("Error al parsear el usuario en sessionStorage:", error);
      }
    }
  }, []);

  // 🔹 Consulta inicial del estado del tablero al backend
  useEffect(() => {
    const fetchBoard = async () => {
      if (!gameId) return;
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000)); //Aqui se puede poner una pantalla de carga o algo parecido
        setLoading(true);
        const data = await getBoardState(gameId); // 👈 usamos el service
        setBoardData(data);
      } catch (error) {
        console.error("Error cargando el estado del tablero:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [gameId]);

  // 🔹 Callback de estadísticas (desde CanvasBoard)
  const handleStatsChange = useCallback(
    (
      updatedStats: {
        totalPaintable: number;
        paintedCount: number;
        remaining: number;
      },
      clearGrid: () => void
    ) => {
      setStats(updatedStats);
      setClearGridFn(() => clearGrid);
    },
    []
  );

  if (!playerId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>No se encontró el usuario. Inicia sesión nuevamente.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Cargando tablero...</p>
      </div>
    );
  }

  if (!boardData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Error al cargar el tablero o no existe.</p>
      </div>
    );
  }

  const { grid, players } = boardData;

  // ✅ Render principal
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
          players={Object.values(players)} // Pasamos lista de jugadores
        />
      </div>
    </div>
  );
};

export default BoardPage;
