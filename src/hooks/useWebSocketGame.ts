import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, type IMessage, StompHeaders } from "@stomp/stompjs";

interface PlatformUpdate {
  row: number;
  col: number;
  color: string;
}

interface PlayerUpdate {
  playerId: string;
  newRow: number;
  newCol: number;
  alive: boolean;
}

interface MoveResult {
  playerId: string;
  newRow: number;
  newCol: number;
  platforms: PlatformUpdate[];
  affectedPlayers: PlayerUpdate[];
  success: boolean;
}

interface PlayerMoveMessage {
  playerId: string;
  direction: string; // "UP", "DOWN", "LEFT", "RIGHT"
  room: string;
}

export function useWebSocketGame(gameId: string, playerId: string) {
  const [connected, setConnected] = useState(false);
  const [moveResults, setMoveResults] = useState<MoveResult[]>([]);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    console.log("🎮 Conectando WebSocket del juego...");
    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP GAME]", str),
    });

    client.onConnect = () => {
      console.log("✅ Conectado al WebSocket del juego:", gameId);
      setConnected(true);

      // Suscripción al tablero del juego
      client.subscribe(`/topic/board.${gameId}`, (message: IMessage) => {
        try {
          const result: MoveResult = JSON.parse(message.body);
          setMoveResults((prev) => [...prev, result]);
        } catch (err) {
          console.error("Error parseando mensaje de movimiento:", err);
        }
      });

      // Suscripción a mensajes privados del usuario
      client.subscribe(`/user/queue/reply`, (message: IMessage) => {
        try {
          const result: MoveResult = JSON.parse(message.body);
          console.warn("[WS] Respuesta privada:", result);
        } catch (err) {
          console.error("Error parseando respuesta privada:", err);
        }
      });
    };

    client.onDisconnect = () => {
      console.log("❌ Desconectado del WebSocket del juego:", gameId);
      setConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("🔌 Cerrando conexión del juego...");
      client.deactivate();
      clientRef.current = null;
    };
  }, [gameId]);

  const sendMove = useCallback(
    (direction: string) => {
      const client = clientRef.current;
      if (client && client.connected) {
        const moveMessage: PlayerMoveMessage = {
          playerId,
          direction,
          room: gameId,
        };

        const headers: StompHeaders = {};
        console.log("📤 Enviando movimiento:", moveMessage);

        client.publish({
          destination: `/app/move.${gameId}`,
          body: JSON.stringify(moveMessage),
          headers,
        });
      } else {
        console.warn("⚠️ WebSocket no conectado, no se puede enviar movimiento.");
      }
    },
    [connected, gameId, playerId]
  );

  return {
    connected,
    moveResults,
    sendMove,
  };
}
