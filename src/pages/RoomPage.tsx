import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { waitingRoomService } from "../services/waitingRoomService";
import type { AxiosError } from "axios";

export const RoomPage: React.FC = () => {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("RoomPage mounted - Auth check:", {
      token: sessionStorage.getItem("token"),
      user: sessionStorage.getItem("user"),
      correlationId: sessionStorage.getItem("correlationId"),
    });
  }, []);

  const getPlayerId = (): string => {
    let correlationId = sessionStorage.getItem("correlationId");
    if (!correlationId) {
      correlationId = crypto.randomUUID();
      sessionStorage.setItem("correlationId", correlationId);
    }
    return correlationId;
  };

  const handleCreateRoom = async () => {
    const playerId = getPlayerId();
    try {
      setLoading(true);
      const state = await waitingRoomService.createRoom(playerId);
      navigate(`/waitingroom/${state.roomId}`, { state });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      if (err.response?.status === 401) {
        sessionStorage.clear();
        window.location.href = "/login";
      } else {
        alert("No se pudo crear la sala. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) {
      alert("Por favor ingresa un código de sala válido.");
      return;
    }

    const playerId = getPlayerId();
    try {
      setLoading(true);
      const state = await waitingRoomService.joinRoom(joinCode.trim(), playerId);
      navigate(`/waitingroom/${state.roomId}`, { state });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      if (err.response?.status === 401) {
        sessionStorage.clear();
        window.location.href = "/login";
      } else if (err.response?.status === 404) {
        alert("No se encontró la sala.");
      } else if (err.response?.status === 400) {
        alert("La sala está llena.");
      } else {
        alert("Error al unirse a la sala. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden p-10">
      <div className="relative bg-gray-800 border-4 border-sky-500 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12 w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-10 text-sky-400">Sala de Partidas</h1>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">¿Quieres ser anfitrión?</h2>
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-sky-500 transition-colors text-white py-4 rounded-2xl font-semibold text-lg shadow-md disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear nueva partida"}
          </button>
        </div>

        <div className="flex items-center justify-center my-8">
          <div className="w-1/3 border-t border-gray-600"></div>
          <span className="mx-4 text-gray-400 text-base font-medium">o</span>
          <div className="w-1/3 border-t border-gray-600"></div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">¿Tienes un código?</h2>
          <input
            type="text"
            placeholder="Ingresa el código"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="w-full p-4 text-gray-900 rounded-2xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg"
          />
        </div>

        <button
          onClick={handleJoinRoom}
          disabled={loading}
          className="w-full bg-gray-700 hover:bg-sky-500 transition-colors text-white py-4 rounded-2xl font-semibold text-lg shadow-md disabled:opacity-50"
        >
          {loading ? "Uniéndose..." : "Unirse a la partida"}
        </button>
      </div>
    </div>
  );
};

export default RoomPage;
