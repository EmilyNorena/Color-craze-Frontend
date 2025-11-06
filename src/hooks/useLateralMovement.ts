// src/hooks/useLateralMovement.ts
import { useState, useEffect, useRef } from "react";
import type { move } from "../types/board/move";

interface MovementState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  isGrounded: boolean;
}

interface UseLateralMovementProps {
  initialPosition?: { x: number; y: number };
  speed?: number;
  boundaries?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  onMove?: (direction: move) => void; // callback para enviar movimiento al backend
}

export const useLateralMovement = ({
  initialPosition = { x: 0, y: 0 },
  speed = 5,
  boundaries,
  onMove,
}: UseLateralMovementProps = {}) => {
  const [movement, setMovement] = useState<MovementState>({
    position: initialPosition,
    velocity: { x: 0, y: 0 },
    isGrounded: true,
  });

  const keys = useRef({ left: false, right: false });
  const lastDirection = useRef<move | null>(null);

  // Manejo de teclas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keys.current.left = true;
      if (e.key === "ArrowRight") keys.current.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keys.current.left = false;
      if (e.key === "ArrowRight") keys.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Loop de movimiento
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setMovement((prev) => {
        let newVelocityX = 0;
        let currentDirection: move | null = null;

        if (keys.current.left) currentDirection = "LEFT";
        if (keys.current.right) currentDirection = "RIGHT";

        // Enviar movimiento al backend solo si cambia la dirección
        if (currentDirection !== lastDirection.current && currentDirection && onMove) {
          onMove(currentDirection);
          lastDirection.current = currentDirection;
        }

        if (!currentDirection) lastDirection.current = null;

        newVelocityX =
          currentDirection === "LEFT"
            ? -speed
            : currentDirection === "RIGHT"
            ? speed
            : 0;

        let newX = prev.position.x + newVelocityX;
        let newY = prev.position.y;

        if (boundaries) {
          newX = Math.max(boundaries.left, Math.min(boundaries.right, newX));
          newY = Math.max(boundaries.top, Math.min(boundaries.bottom, newY));
        }

        return {
          position: { x: newX, y: newY },
          velocity: { x: newVelocityX, y: 0 },
          isGrounded: true,
        };
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [speed, boundaries, onMove]);

  return {
    position: movement.position,
    velocity: movement.velocity,
    isGrounded: movement.isGrounded,
    setPosition: (pos: { x: number; y: number }) =>
      setMovement((prev) => ({ ...prev, position: pos })),
  };
};
