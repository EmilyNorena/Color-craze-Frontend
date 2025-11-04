import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import avatarYellow from "../assets/avatar1.png";
import avatarPink from "../assets/avatar2.png";
import avatarPurple from "../assets/avatar3.png";
import avatarGreen from "../assets/avatar4.png";
import { useWebSocketWaitingRoom } from "../hooks/useWebSocketWaitingRoom";

interface Player {
  id: string;
  name: string;
  avatar: string;
}

interface ColorError {
  playerId: string;
  color: string;
}

interface WaitingRoomState {
  roomId: string;
  players: string[];
  playerColors: Record<string, string>;
  full: boolean;
  seconds: number;
}

export const WaitingRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const [timer, setTimer] = useState(5);
  const [players, setPlayers] = useState<Player[]>([]);
  const [host, setHost] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  const avatarInfo: Record<string, { image: string; color: string }> = {
    YELLOW: { image: avatarYellow, color: "#fcaf01" },
    PINK: { image: avatarPink, color: "#fb038e" },
    PURPLE: { image: avatarPurple, color: "#7304d7" },
    GREEN: { image: avatarGreen, color: "#77c914" },
  };

  // Memoriza el procesamiento de estado
  const processRoomState = useCallback((roomState: WaitingRoomState) => {
    console.log("🎮 Procesando estado de sala:", roomState);
    if (!roomState.players || roomState.players.length === 0) return;

    setTimer(roomState.seconds);

    const hostPlayerId = roomState.players[0];
    const hostColor = roomState.playerColors[hostPlayerId];

    const hostData: Player = {
      id: hostPlayerId,
      name:
        hostPlayerId === localStorage.getItem("playerId")
          ? "Tú (Anfitrión)"
          : "Anfitrión",
      avatar: hostColor || "YELLOW",
    };

    const otherPlayers: Player[] = roomState.players.slice(1).map((playerId, index) => {
      const playerColor = roomState.playerColors[playerId];
      return {
        id: playerId,
        name:
          playerId === localStorage.getItem("playerId")
            ? "Tú"
            : `Jugador ${index + 2}`,
        avatar: playerColor || "YELLOW",
      };
    });

    setHost(hostData);
    setPlayers(otherPlayers);
    setLoading(false);
  }, []);

  // Memoriza el manejo de error
  const handleColorError = useCallback((error: ColorError) => {
    alert(`No se pudo seleccionar el color ${error.color} para el jugador ${error.playerId}`);
  }, []);

  // Carga estado inicial desde navegación
  useEffect(() => {
    const initialState = location.state as WaitingRoomState;
    if (initialState) processRoomState(initialState);
  }, [location.state, processRoomState]);

  // Conexión WebSocket (solo se reconecta si cambia roomId)
  const { selectColor } = useWebSocketWaitingRoom<WaitingRoomState, ColorError>(
    roomId!,
    processRoomState,
    handleColorError
  );

  const handleColorSelect = (color: string) => {
    const playerId = localStorage.getItem("playerId")!;
    selectColor({ playerId, color });
  };

  // Navegar automáticamente cuando el timer llegue a 0
  useEffect(() => {
    if (timer === 0) navigate(`/board/${roomId}`);
  }, [timer, navigate, roomId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-xl">Esperando jugadores...</div>
      </div>
    );
  }

  if (!host) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-xl text-red-400">Sala no encontrada</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden p-10">
      {/* Header */}
      <div className="w-full max-w-4xl bg-gray-800 border-4 border-sky-500 rounded-3xl shadow-lg p-6 mb-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-xl font-semibold text-sky-400">Anfitrión</h2>
          <div className="flex items-center gap-3 mt-2">
            <img
              src={avatarInfo[host.avatar]?.image}
              alt={host.name}
              className="w-12 h-12 rounded-full"
            />
            <span className="text-lg font-medium">{host.name}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg text-gray-300 mb-1">La partida inicia en</h3>
          <div className="text-4xl font-bold text-sky-400">{timer}s</div>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <h3 className="text-lg text-gray-300 mb-1">Código de la sala</h3>
          <div className="text-3xl font-mono bg-gray-700 border border-sky-500 px-4 py-2 rounded-xl text-sky-300 tracking-widest">
            {roomId || "ABC123"}
          </div>
        </div>
      </div>

      {/* Selección de color */}
      <div className="flex gap-4 mt-6 justify-center">
        {Object.keys(avatarInfo).map((colorKey) => {
          const isSelected =
            host?.avatar === colorKey || players.some((p) => p.avatar === colorKey);
          return (
            <button
              key={colorKey}
              className={`w-12 h-12 rounded-full border-4 ${
                isSelected ? "border-sky-400" : "border-white"
              }`}
              style={{ backgroundColor: avatarInfo[colorKey].color }}
              onClick={() => handleColorSelect(colorKey)}
            />
          );
        })}
      </div>

      {/* Lista de jugadores */}
      <div className="w-full max-w-3xl bg-gray-800 border-4 border-sky-500 rounded-3xl shadow-lg p-8 mt-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-sky-400">
          Jugadores en la sala ({players.length + 1})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">
          {/* Host */}
          <div className="flex flex-col items-center bg-gray-700/60 p-4 rounded-2xl w-28 h-32 border-2 border-sky-500">
            <img
              src={avatarInfo[host.avatar]?.image}
              alt={host.name}
              className="w-14 h-14 rounded-full mb-3"
            />
            <span className="text-sm font-medium text-center text-sky-300">
              {host.name}
            </span>
          </div>

          {/* Otros jugadores */}
          {players.map((player) => (
            <div
              key={player.id}
              className="flex flex-col items-center bg-gray-700/60 p-4 rounded-2xl w-28 h-32 border border-gray-600 hover:border-sky-500 transition-all"
            >
              <img
                src={avatarInfo[player.avatar]?.image}
                alt={player.name}
                className="w-14 h-14 rounded-full mb-3"
              />
              <span className="text-sm font-medium text-center">{player.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomPage;
