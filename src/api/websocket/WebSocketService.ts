import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export class WebSocketService {
private client: Client;
private connected = false;
private baseUrl: string;

constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.client = new Client({
    webSocketFactory: () => new SockJS(`${this.baseUrl}/color-craze/ws`),
    reconnectDelay: 5000,
    debug: (str) => console.log(str),
    });
}

connect(onConnect?: () => void, onError?: (e: any) => void) {
    this.client.onConnect = () => {
    this.connected = true;
    console.log("✅ Connected to WebSocket");
    if (onConnect) onConnect();
    };

    this.client.onStompError = (frame) => {
    console.error("❌ Broker error:", frame.headers["message"]);
    console.error(frame.body);
    if (onError) onError(frame.body);
    };

    this.client.activate();
}

subscribe(topic: string, onMessage: (msg: any) => void) {
    if (!this.connected) {
    console.warn("⚠️ Not connected yet");
    return;
    }

    this.client.subscribe(topic, (message: IMessage) => {
    const body = JSON.parse(message.body);
    onMessage(body);
    });
}

send(destination: string, payload: any) {
    if (!this.connected) {
    console.warn("⚠️ Not connected yet");
    return;
    }

    this.client.publish({
    destination,
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
