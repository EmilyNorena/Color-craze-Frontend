import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, type IMessage } from "@stomp/stompjs";

export interface SelectColorMessage {
playerId: string;
color: string;
}

export const useWebSocketWaitingRoom = (
roomId: string,
onRoomUpdate: (state: any) => void,
onColorError: (error: any) => void
) => {
const clientRef = useRef<Client | null>(null);

useEffect(() => {
    const socket = new SockJS("http://localhost:8080/color-craze/ws");
    const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    });

    client.onConnect = () => {
    console.log("✅ Conectado a WaitingRoom WebSocket");

    client.subscribe(`/topic/waiting-room/${roomId}`, (message: IMessage) => {
        onRoomUpdate(JSON.parse(message.body));
    });

    client.subscribe(`/user/queue/waiting-room/color-error`, (message: IMessage) => {
        onColorError(JSON.parse(message.body));
    });
    };

    client.activate();
    clientRef.current = client;

    return () => {
    client.deactivate();
    clientRef.current = null;
    console.log("🔌 Desconectado de WaitingRoom WebSocket");
    };
}, [roomId]);

const selectColor = (message: SelectColorMessage) => {
    if (clientRef.current?.connected) {
    clientRef.current.publish({
        destination: `/app/waiting-room/${roomId}/select-color`,
        body: JSON.stringify(message),
    });
    } else {
    console.warn("⚠️ No conectado al WebSocket aún");
    }
};

return { selectColor };
};
