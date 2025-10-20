import React, { useState, useEffect } from "react";
import { Avatar } from "../components/Avatar";

export const WaitingRoomPage: React.FC = () => {
  // Simulación (por ahora estático)
  const [timer, setTimer] = useState(30);
  const [roomCode] = useState("ABC123");
  const [host] = useState({ id: "1", name: "Anfitrión", avatar: "avatar1" });
  const [players] = useState([
    { id: "2", name: "Jugador 1", avatar: "avatar2" },
    { id: "3", name: "Jugador 2", avatar: "avatar3" },
    { id: "4", name: "Jugador 3", avatar: "avatar4" },
  ]);

  // Cuenta regresiva simulada (solo visual)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden p-10">
      <div className="w-full max-w-4xl bg-gray-800 border-4 border-sky-500 rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.4)] p-6 mb-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-xl font-semibold text-sky-400">Anfitrión</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="relative w-12 h-12">
              <Avatar playerId={host.id} size={50} />
            </div>
            <span className="text-lg font-medium">{host.name}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg text-gray-300 mb-1">La partida inicia en</h3>
          <div className="text-4xl font-bold text-sky-400">{timer}s</div>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <h3 className="text-lg text-gray-300 mb-1">Código de la sala</h3>
          <div className="text-3xl font-mono bg-gray-700 border border-sky-500 px-4 py-2 rounded-xl text-sky-300 tracking-widest">
            {roomCode}
          </div>
        </div>
      </div>

      {/* Lista de jugadores */}
      <div className="w-full max-w-3xl bg-gray-800 border-4 border-sky-500 rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.4)] p-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-sky-400">
          Jugadores en la sala
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">
          {[host, ...players].map((player) => (
            <div
              key={player.id}
              className="flex flex-col items-center bg-gray-700/60 p-4 rounded-2xl w-28 h-32 border border-gray-600 hover:border-sky-500 transition-all"
            >
              <div className="relative w-14 h-14 mb-3">
                <Avatar playerId={player.id} size={56} />
              </div>
              <span className="text-sm font-medium text-center">
                {player.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomPage;
