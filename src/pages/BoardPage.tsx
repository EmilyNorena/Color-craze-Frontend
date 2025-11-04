import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoardCanvas from "../components/BoardCanvas";
import { useWebSocketGame } from "../hooks/useWebSocketGame";

interface Player {
  id: string;
  row: number;
  col: number;
  color: string;
  alive?: boolean;
}

interface PlatformUpdate {
  row: number;
  col: number;
  color: string;
}

interface MoveResult {
  playerId: string;
  newRow: number;
  newCol: number;
  platforms: PlatformUpdate[];
  affectedPlayers: any[];
  success: boolean;
}

const BoardPage: React.FC = () => {
  const { roomId } = useParams();
  const playerId = localStorage.getItem("playerId") || "anon"; // ⚠️ Ajusta según tu auth
  const { connected, moveResults, sendMove } = useWebSocketGame(roomId!, playerId);

  const [grid, setGrid] = useState<string[][]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  // Cargar tablero inicial
  useEffect(() => {
    // ⚠️ Aquí eventualmente harás un fetch al backend:
    // const response = await fetch(`/api/board/${roomId}/state`);
    // const data = await response.json();
    // setGrid(data.grid);
    // setPlayers(data.players);

    // Por ahora, un tablero base vacío con 2 jugadores de ejemplo:
    const rows = 15;
    const cols = 31;
    const emptyGrid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => "WHITE")
    );

    const dummyPlayers = [
      { id: "1", row: 5, col: 10, color: "RED" },
      { id: "2", row: 8, col: 15, color: "BLUE" },
    ];

    setGrid(emptyGrid);
    setPlayers(dummyPlayers);
  }, [roomId]);

  // Escuchar actualizaciones del WebSocket
  useEffect(() => {
    if (moveResults.length === 0) return;

    const lastMove = moveResults[moveResults.length - 1];
    if (!lastMove.success) return;

    setPlayers((prevPlayers) =>
      prevPlayers.map((p) =>
        p.id === lastMove.playerId
          ? { ...p, row: lastMove.newRow, col: lastMove.newCol }
          : p
      )
    );

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);

      // Actualizar plataformas pintadas
      lastMove.platforms.forEach((p) => {
        newGrid[p.row][p.col] = p.color;
      });

      return newGrid;
    });
  }, [moveResults]);

  // Controles de movimiento
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        sendMove("UP");
        break;
      case "ArrowDown":
        sendMove("DOWN");
        break;
      case "ArrowLeft":
        sendMove("LEFT");
        break;
      case "ArrowRight":
        sendMove("RIGHT");
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sendMove]);

  return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-2xl mb-2">🎮 Game Board</h1>
      <p className="mb-4 text-sm">
        Room: <b>{roomId}</b> | Player: <b>{playerId}</b> |{" "}
        {connected ? "🟢 Conectado" : "🔴 Desconectado"}
      </p>

      {grid.length > 0 ? (
        <BoardCanvas grid={grid} players={players} />
      ) : (
        <p>Cargando tablero...</p>
      )}
    </div>
  );
};

export default BoardPage;
