import React, { useState } from "react";

export const RoomPage: React.FC = () => {
  const [joinCode, setJoinCode] = useState("");

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden p-10">
      <div className="relative bg-gray-800 border-4 border-sky-500 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-12 w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-10 text-sky-400">
          Sala de Partidas
        </h1>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">¿Quieres ser anfitrión?</h2>
          <button
            className="w-full bg-gray-700 hover:bg-sky-500 transition-colors text-white py-4 rounded-2xl font-semibold text-lg shadow-md"
          >
            🎮 Crear nueva partida
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
          className="w-full bg-gray-700 hover:bg-sky-500 transition-colors text-white py-4 rounded-2xl font-semibold text-lg shadow-md"
        >
          🚀 Unirse a la partida
        </button>
      </div>
    </div>
  );
};

export default RoomPage;
