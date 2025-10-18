import { useEffect, useRef } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const useWebSocketGame = (gameId: string, onMessage: (msg: any) => void) => {
const clientRef = useRef<Client | null>(null);

useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    });

    client.onConnect = () => {
    console.log("✅ Conectado a WebSocket");

    client.subscribe(`/topic/board.${gameId}`, (message: IMessage) => {
        onMessage(JSON.parse(message.body));
    });

    client.subscribe(`/user/queue/reply`, (message: IMessage) => {
        onMessage(JSON.parse(message.body));
    });
    };

    client.activate();
    clientRef.current = client;

    return () => {
    client.deactivate();
    clientRef.current = null;
    };
}, [gameId]);

const sendMove = (playerId: string, direction: string) => {
    if (clientRef.current?.connected) {
    clientRef.current.publish({
        destination: `/app/move.${gameId}`,
        body: JSON.stringify({ playerId, direction }),
    });
    }
};

return { sendMove };
};
