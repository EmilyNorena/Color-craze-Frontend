import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { PlayerMove } from "./types/playerMove";

export class WebSocketService {
private client: Client;
private connected = false;

private baseUrl: string;
private gameId: string;

constructor(baseUrl: string, gameId: string) {
    this.baseUrl = baseUrl;
    this.gameId = gameId;
    this.client = new Client({
    webSocketFactory: () => new SockJS(`${this.baseUrl}/color-craze/ws`),
    debug: (str) => console.log(str),
    });
}

connect(onMessage: (msg: any) => void) {
    this.client.onConnect = () => {
    this.connected = true;
    console.log("✅ Connected to WebSocket");

    this.client.subscribe(`/topic/board.${this.gameId}`, (message: IMessage) => {
        const body = JSON.parse(message.body);
        onMessage(body);
    });
    };

    this.client.onStompError = (frame) => {
    console.error("❌ Broker error:", frame.headers["message"]);
    console.error(frame.body);
    };

    this.client.activate();
}

sendMove(playerId: string, direction: PlayerMove) {
    if (!this.connected) return;
    const payload = { playerId, direction };
    this.client.publish({
    destination: `/app/move.${this.gameId}`,
    body: JSON.stringify(payload),
    });
}

disconnect() {
    if (this.client.active) {
    this.client.deactivate();
    this.connected = false;
    console.log("🔌 Disconnected from WebSocket");
    }
}
}
