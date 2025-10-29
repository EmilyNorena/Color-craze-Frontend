// RoomPage.tsx - Con más debug
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { waitingRoomService } from "../services/waitingRoomService";

export const RoomPage: React.FC = () => {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Debug inicial
    console.log("🏠 RoomPage mounted - Auth check:", {
      token: sessionStorage.getItem("token"),
      user: sessionStorage.getItem("user"),
      playerId: localStorage.getItem("playerId")
    });
  }, []);

  const playerId = localStorage.getItem("playerId") || crypto.randomUUID();

  const handleCreateRoom = async () => {
    try {
      console.log("🎯 Starting createRoom...");
      setLoading(true);
      
      const token = sessionStorage.getItem("token");
      console.log("🔐 Token being sent:", token);
      
      const state = await waitingRoomService.createRoom(playerId);
      console.log("✅ Create room success:", state);
      
      // Guardar playerId en localStorage si es nuevo
      if (!localStorage.getItem("playerId")) {
        localStorage.setItem("playerId", playerId);
      }
      
      // Navegar pasando el estado completo como segundo parámetro
      navigate(`/waitingroom/${state.roomId}`, { state: state });
    } catch (error: any) {
      console.error("❌ Create room error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        alert("Tu sesión ha expirado. Serás redirigido al login.");
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

    try {
      console.log("🎯 Starting joinRoom...", { roomId: joinCode.trim() });
      setLoading(true);
      
      const state = await waitingRoomService.joinRoom(joinCode.trim(), playerId);
      console.log("✅ Join room success:", state);
      
      // Guardar playerId en localStorage si es nuevo
      if (!localStorage.getItem("playerId")) {
        localStorage.setItem("playerId", playerId);
      }
      
      // Navegar pasando el estado completo como segundo parámetro
      navigate(`/waitingroom/${state.roomId}`, { state: state });
    } catch (error: any) {
      console.error("❌ Join room error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        alert("Tu sesión ha expirado. Serás redirigido al login.");
        sessionStorage.clear();
        window.location.href = "/login";
      } else if (error.response?.status === 404) {
        alert("No se encontró la sala.");
      } else if (error.response?.status === 400) {
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
        <h1 className="text-4xl font-bold mb-10 text-sky-400">
          Sala de Partidas
        </h1>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">¿Quieres ser anfitrión?</h2>
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-sky-500 transition-colors text-white py-4 rounded-2xl font-semibold text-lg shadow-md disabled:opacity-50"
          >
            🎮 {loading ? "Creando..." : "Crear nueva partida"}
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
          🚀 {loading ? "Uniéndose..." : "Unirse a la partida"}
        </button>
      </div>
    </div>
  );
};

export default RoomPage;