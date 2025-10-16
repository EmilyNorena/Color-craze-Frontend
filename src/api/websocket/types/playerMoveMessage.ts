import type { PlayerMove } from "./playerMove";

export interface PlayerMoveMessage {
    playerId: string;
    direction: PlayerMove;
    room: string;
}
