import { useEffect, useRef, useCallback } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const useWebSocketGame = <T = unknown>(
  gameId: string,
  onMessage: (msg: T) => void
) => {
  const clientRef = useRef<Client | null>(null);

  // Usar useCallback para estabilizar la función onMessage
  const stableOnMessage = useCallback(onMessage, [onMessage]);

  useEffect(() => {
    console.log(`🔄 useWebSocketGame useEffect ejecutado para gameId: ${gameId}`);

    const socket = new SockJS("https://color-craze-backend-drggg9g2bsfqhkab.canadacentral-01.azurewebsites.net/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ Conectado a WebSocket - GameId:", gameId);

      const handleMessage = (message: IMessage) => {
        try {
          const parsed = JSON.parse(message.body) as T;
          stableOnMessage(parsed);
        } catch (err) {
          console.error("❌ Error parsing WebSocket message:", err);
        }
      };

      client.subscribe(`/topic/board.${gameId}`, handleMessage);
      client.subscribe(`/user/queue/reply`, handleMessage);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("🧹 Limpiando WebSocket connection");
      client.deactivate();
      clientRef.current = null;
    };
  }, [gameId, stableOnMessage]); // ✅ Agregar stableOnMessage a las dependencias

  const sendMove = (playerId: string, direction: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/move`,
        body: JSON.stringify({ playerId, direction }),
      });
    }
  };

  return { sendMove };
};