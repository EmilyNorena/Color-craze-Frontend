import { useState, useCallback, useEffect } from "react";
import CanvasBoard from "../components/CanvasBoard";
import { Avatar } from "../components/Avatar";
import StatsPanel from "../components/StatsPanel";

export const BoardPage = () => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalPaintable: number;
    paintedCount: number;
    remaining: number;
  } | null>(null);
  const [clearGridFn, setClearGridFn] = useState<(() => void) | null>(null);

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

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden p-8">
      {!playerId ? (
        <div className="flex items-center justify-center min-h-screen text-white">
          <p>No se encontró el usuario. Inicia sesión nuevamente.</p>
        </div>
      ) : (
        <>
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
            />

            <div className="absolute inset-0 pointer-events-none">
              <Avatar
                playerId={playerId}
                size={60}
                gameBoard={{ width: 1240, height: 600 }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BoardPage;
