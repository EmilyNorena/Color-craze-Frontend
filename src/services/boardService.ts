import type { BoardData } from "../types/board/boardData";

export const getBoardState = async (gameId: string): Promise<BoardData> => {
  const response = await fetch(`http://localhost:8080/api/games/${gameId}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: no se pudo obtener el board`);
  }

  const data = await response.json();
  console.log("📦 Estado inicial del tablero recibido (service):", data);
  return data;
};
