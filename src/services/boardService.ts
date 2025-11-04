export interface BoardData {
  grid: string[][];
  players: Record<string, any>;
}

/**
 * Obtiene el estado actual del tablero desde el backend.
 * @param gameId ID de la partida
 * @returns Datos del tablero (grid, jugadores, etc.)
 */
export const getBoardState = async (gameId: string): Promise<BoardData> => {
  const response = await fetch(`http://localhost:8080/api/games/${gameId}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: no se pudo obtener el board`);
  }

  const data = await response.json();
  console.log("📦 Estado inicial del tablero recibido (service):", data);
  return data;
};
