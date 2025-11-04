import { useEffect, useState } from "react";
import CanvasBoard from "../components/CanvasBoard";
import type { Player } from "../types/player";

export const BoardPage = () => {
  const [playerId, setPlayerId] = useState<string | null>(null);

  const [grid, setGrid] = useState<string[][]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const rows = 15;
  const cols = 31;

  // ✅ Inicializar tablero y plataformas
  useEffect(() => {
    // base vacía
    const newGrid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => "EMPTY")
    );

    // generar plataformas aleatorias
    const platformCount = 80;
    for (let i = 0; i < platformCount; i++) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      newGrid[r][c] = "PLATFORM"; // gris oscuro base
    }

    // jugadores iniciales
    const initialPlayers: Player[] = [
      { id: "1", row: 3, col: 5, color: "YELLOW" },
      { id: "2", row: 6, col: 10, color: "RED" },
      { id: "3", row: 8, col: 7, color: "PURPLE" },
      { id: "4", row: 10, col: 15, color: "GREEN" },
    ];

    setGrid(newGrid);
    setPlayers(initialPlayers);

    // función para actualizar pintura alrededor del jugador
    const paintAdjacent = (r: number, c: number, color: string) => {
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      directions.forEach(([dr, dc]) => {
        const rr = r + dr;
        const cc = c + dc;
        if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
          if (newGrid[rr][cc] === "PLATFORM" || newGrid[rr][cc].startsWith("PLATFORM_")) {
            newGrid[rr][cc] = `PLATFORM_${color}`;
          }
        }
      });
    };

    // simular movimiento y pintura
    const interval = setInterval(() => {
      setPlayers((prev) =>
        prev.map((p) => {
          const dir = Math.floor(Math.random() * 4);
          let newRow = p.row;
          let newCol = p.col;
          if (dir === 0 && newRow > 0) newRow--; // arriba
          if (dir === 1 && newRow < rows - 1) newRow++; // abajo
          if (dir === 2 && newCol > 0) newCol--; // izquierda
          if (dir === 3 && newCol < cols - 1) newCol++; // derecha

          // pintar plataformas cercanas
          paintAdjacent(newRow, newCol, p.color);
          return { ...p, row: newRow, col: newCol };
        })
      );

      setGrid([...newGrid]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // obtener ID del jugador del sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) setPlayerId(parsedUser.id);
      } catch (err) {
        console.error("Error al parsear usuario:", err);
      }
    }
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden p-8">
      {!playerId ? (
        <div className="flex items-center justify-center min-h-screen text-white">
          <p>No se encontró el usuario. Inicia sesión nuevamente.</p>
        </div>
      ) : (
        <div className="relative bg-gray-800 border-4 border-sky-500 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] p-6 flex items-center justify-center">
          <CanvasBoard grid={grid} players={players} rows={rows} cols={cols} blockSize={40} />
        </div>
      )}
    </div>
  );
};

export default BoardPage;
