import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, type IMessage, StompHeaders } from "@stomp/stompjs";
import type { MoveResult } from "../types/board/moveResult";
import type { PlayerMoveMessage } from "../api/websocket/types/playerMoveMessage";


export function useWebSocketGame(gameId: string, playerId: string) {
  const [connected, setConnected] = useState(false);
  const [moveResults, setMoveResults] = useState<MoveResult[]>([]);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    console.log("🎮 Conectando WebSocket del juego...");
    const socket = new SockJS("https://color-craze-backend-drggg9g2bsfqhkab.canadacentral-01.azurewebsites.net/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP GAME]", str),
    });

    client.onConnect = () => {
      console.log("✅ Conectado al WebSocket del juego:", gameId);
      setConnected(true);

      client.subscribe(`/topic/board.${gameId}`, (message: IMessage) => {
        try {
          const result: MoveResult = JSON.parse(message.body);
          setMoveResults((prev) => [...prev, result]);
        } catch (err) {
          console.error("Error parseando mensaje de movimiento:", err);
        }
      });

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
    [gameId, playerId]
  );


  return {
    connected,
    moveResults,
    sendMove,
  };
}
