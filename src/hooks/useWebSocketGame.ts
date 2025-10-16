import { useEffect, useRef } from "react";
import { WebSocketService } from "../api/websocket/WebSocketService";
import type { PlayerMove } from "../api/websocket/types/playerMove";

export function useWebSocketGame(gameId: string, onMessage: (msg: any) => void) {
const wsRef = useRef<WebSocketService | null>(null);

useEffect(() => {
    wsRef.current = new WebSocketService("http://localhost:8080", gameId);
    wsRef.current.connect(onMessage);

    return () => {
    wsRef.current?.disconnect();
    };
}, [gameId, onMessage]);

const sendMove = (playerId: string, direction: PlayerMove) => {
    wsRef.current?.sendMove(playerId, direction);
};
return { sendMove };
}
