import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/waiting-room";

export const waitingRoomService = {

async createRoom(playerId: string) {
    const response = await axios.post(`${API_BASE_URL}/create`, null, {
    params: { playerId },
    });
    return response.data;
},


async joinRoom(roomId: string, playerId: string) {
    const response = await axios.post(`${API_BASE_URL}/join/${roomId}/${playerId}`);
    return response.data;
},
};
