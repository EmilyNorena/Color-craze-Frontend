import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import avatarYellow from "../assets/avatar1.png";
import avatarPink from "../assets/avatar2.png";
import avatarPurple from "../assets/avatar3.png";
import avatarGreen from "../assets/avatar4.png";

interface Player {
  id: string;
  name: string;
  avatar: string;
}

interface WaitingRoomState {
  roomId: string;
  players: string[];
  playerColors: Record<string, string>;
  full: boolean;
}

export const WaitingRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const [timer, setTimer] = useState(30);
  const [players, setPlayers] = useState<Player[]>([]);
  const [host, setHost] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const avatarInfo: Record<string, { image: string; color: string }> = {
    YELLOW: { image: avatarYellow, color: "#fcaf01" },
    PINK: { image: avatarPink, color: "#fb038e" },
    PURPLE: { image: avatarPurple, color: "#7304d7" },
    GREEN: { image: avatarGreen, color: "#77c914" },
  };

  // Función para procesar el estado de la sala
  const processRoomState = (roomState: WaitingRoomState) => {
    console.log("🎮 Procesando estado de sala:", roomState);

    if (!roomState.players || roomState.players.length === 0) {
      console.error("❌ No hay jugadores en la sala");
      return;
    }

    // El primer jugador es el anfitrión
    const hostPlayerId = roomState.players[0];
    const hostColor = roomState.playerColors[hostPlayerId];

    // Crear objeto del host
    const hostData: Player = {
      id: hostPlayerId,
      name:
        hostPlayerId === localStorage.getItem("playerId")
          ? "Tú (Anfitrión)"
          : "Anfitrión",
      avatar: hostColor || "YELLOW",
    };

    // Crear array de jugadores (excluyendo al host)
    const otherPlayers: Player[] = roomState.players
      .slice(1)
      .map((playerId, index) => {
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
  };

  // Usar el estado inicial pasado desde RoomPage
  useEffect(() => {
    const initialState = location.state as WaitingRoomState;

    if (initialState) {
      console.log("🎯 Estado inicial recibido:", initialState);
      processRoomState(initialState);
    } else {
      console.log("❌ No se recibió estado inicial, mostrando loading...");
    }
  }, [location.state]);

  useEffect(() => {
    if (!roomId) return;

    console.log("🔌 Conectando WebSocket a sala:", roomId);

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(
          "https://color-craze-backend-drggg9g2bsfqhkab.canadacentral-01.azurewebsites.net/ws"
        ),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket conectado");

        // Suscribirse a las actualizaciones de la sala
        client.subscribe(`/topic/waiting-room/${roomId}`, (message) => {
          try {
            const roomState: WaitingRoomState = JSON.parse(message.body);
            console.log("📨 Mensaje recibido del WebSocket:", roomState);
            processRoomState(roomState);
          } catch (error) {
            console.error("❌ Error procesando mensaje WebSocket:", error);
          }
        });

        console.log("📝 Suscrito a:", `/topic/waiting-room/${roomId}`);
      },
      onStompError: (frame) => {
        console.error("❌ Error en WebSocket:", frame);
      },
      onDisconnect: () => {
        console.log("🔌 WebSocket desconectado");
      },
    });

    client.activate();
    setStompClient(client);

    // Limpieza al desmontar el componente
    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [roomId]);

  // Cuenta regresiva
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="text-xl">
          {stompClient?.connected
            ? "Esperando jugadores..."
            : "Conectando a la sala..."}
        </div>
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
      {/* Header con información de la sala */}
      <div className="w-full max-w-4xl bg-gray-800 border-4 border-sky-500 rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.4)] p-6 mb-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-xl font-semibold text-sky-400">Anfitrión</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="relative w-12 h-12">
              <img
                src={avatarInfo[host.avatar]?.image}
                alt={host.name}
                className="w-12 h-12 rounded-full"
              />
            </div>
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

      {/* Lista de jugadores */}
      <div className="w-full max-w-3xl bg-gray-800 border-4 border-sky-500 rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.4)] p-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-sky-400">
          Jugadores en la sala ({players.length + 1})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">
          {/* Host primero */}
          <div className="flex flex-col items-center bg-gray-700/60 p-4 rounded-2xl w-28 h-32 border-2 border-sky-500">
            <div className="relative w-14 h-14 mb-3">
              <img
                src={avatarInfo[host.avatar]?.image}
                alt={host.name}
                className="w-14 h-14 rounded-full"
              />
            </div>
            <span className="text-sm font-medium text-center text-sky-300">
              {host.name}
            </span>
          </div>

          {/* Demás jugadores */}
          {players.map((player) => (
            <div
              key={player.id}
              className="flex flex-col items-center bg-gray-700/60 p-4 rounded-2xl w-28 h-32 border border-gray-600 hover:border-sky-500 transition-all"
            >
              <div className="relative w-14 h-14 mb-3">
                <img
                  src={avatarInfo[player.avatar]?.image}
                  alt={player.name}
                  className="w-14 h-14 rounded-full"
                />
              </div>
              <span className="text-sm font-medium text-center">
                {player.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomPage;
