import apiClient from "./axiosService";

export interface WaitingRoomState {
  roomId: string;
  players: string[];
  playerColors: Record<string, string>;
  isFull: boolean;
}

export const waitingRoomService = {
  async createRoom(playerId: string): Promise<WaitingRoomState> {
    const response = await apiClient.post<WaitingRoomState>(
      `/api/waiting-room/create/${playerId}`
    );
    return response.data;
  },

  async joinRoom(roomId: string, playerId: string): Promise<WaitingRoomState> {
    const response = await apiClient.post<WaitingRoomState>(
      `/api/waiting-room/join/${roomId}/${playerId}`
    );
    return response.data;
  },
};
