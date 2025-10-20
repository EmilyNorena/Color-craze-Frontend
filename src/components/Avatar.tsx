// src/components/Avatar.tsx
import { useEffect, useState } from "react";
import type { avatar } from "../types/avatar";
import { useLateralMovement } from "../hooks/useLateralMovement";
import { useWebSocketGame } from "../hooks/useWebSocketGame";
import type { move } from "../types/move";

const avatarInfo: Record<avatar, { image: string; color: string }> = {
  avatar1: { image: "src/assets/avatar1.png", color: "#fcaf01" },
  avatar2: { image: "src/assets/avatar2.png", color: "#fb038e" },
  avatar3: { image: "src/assets/avatar3.png", color: "#7304d7" },
  avatar4: { image: "src/assets/avatar4.png", color: "#77c914" },
};

interface AvatarProps {
  size?: number;
  gameBoard?: { width: number; height: number };
  playerId: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 60,
  gameBoard = { width: 800, height: 600 },
  playerId,
}) => {
  const [avatar] = useState<avatar>("avatar1");
  const info = avatarInfo[avatar];

  const gameId = "color-craze-001";
  const { sendMove } = useWebSocketGame(gameId, (msg) => {
    console.log("📩 Mensaje recibido:", msg);
  });

  // Movimiento lateral con envío al servidor
  const { position, velocity } = useLateralMovement({
    initialPosition: { x: gameBoard.width / 2, y: gameBoard.height / 2 },
    speed: 5,
    boundaries: {
      left: 0,
      right: gameBoard.width - size,
      top: 0,
      bottom: gameBoard.height - size,
    },
    onMove: (direction: move) => {
      sendMove(playerId, direction);
    },
  });

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "absolute",
        top: position.y,
        left: position.x,
        transition: "left 0.1s ease, top 0.1s ease",
        transform: `translate(-50%, -50%) scaleX(${velocity.x > 0 ? 1 : -1})`,
      }}
    >
      <img
        src={info.image}
        alt="Avatar"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: velocity.x !== 0 ? "brightness(1.1)" : "none",
        }}
      />
    </div>
  );
};
