import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, type IMessage, StompHeaders } from "@stomp/stompjs";

export interface SelectColorMessage {
  playerId: string;
  color: string;
}

export const useWebSocketWaitingRoom = <T = unknown, E = unknown>(
  roomId: string,
  onRoomUpdate: (state: T) => void,
  onColorError: (error: E) => void
) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS("https://color-craze-backend-drggg9g2bsfqhkab.canadacentral-01.azurewebsites.net/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
    });

    const playerId =
      localStorage.getItem("playerId") || crypto.randomUUID();
    localStorage.setItem("playerId", playerId);

    client.onConnect = () => {
      console.log("✅ Conectado al WebSocket de WaitingRoom");

      // Suscripción al estado general de la sala
      client.subscribe(`/topic/waiting-room/${roomId}`, (message: IMessage) => {
        try {
          const parsed = JSON.parse(message.body) as T;
          onRoomUpdate(parsed);
        } catch (err) {
          console.error("Error parseando mensaje de room:", err);
        }
      });

      // Suscripción a errores específicos de usuario
      client.subscribe(`/user/queue/waiting-room/color-error`, (message: IMessage) => {
        try {
          const parsed = JSON.parse(message.body) as E;
          onColorError(parsed);
        } catch (err) {
          console.error("Error parseando error de color:", err);
        }
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("🔌 Desconectando de WaitingRoom WebSocket...");
      client.deactivate();
      clientRef.current = null;
    };
  }, [roomId, onRoomUpdate, onColorError]);

  /** Envía selección de color al backend */
  const selectColor = (message: SelectColorMessage) => {
    const client = clientRef.current;
    if (client && client.connected) {
      const headers: StompHeaders = {};
      console.log("📤 Enviando color:", message);

      client.publish({
        destination: `/app/waiting-room/${roomId}/select-color`,
        body: JSON.stringify(message),
        headers,
      });
    } else {
      console.warn("⚠️ WebSocket no conectado aún, no se puede enviar color.");
    }
  };

  return { selectColor };
};
