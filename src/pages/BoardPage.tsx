// src/pages/BoardPage.tsx
import CanvasBoard from "../components/CanvasBoard";
import { Avatar } from "../components/Avatar";

export const BoardPage = () => {
    return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-900 via-sky-700 to-sky-500 text-white overflow-hidden">

      <div className="relative bg-gray-800 rounded-2xl shadow-2xl p-6 border-4 border-sky-400">
        <CanvasBoard rows={15} cols={31} blockSize={40} />
        
        <div className="absolute inset-0">
          <Avatar size={60} gameBoard={{ width: 1240, height: 600 }} />
        </div>
      </div>
    </div>
  );

}