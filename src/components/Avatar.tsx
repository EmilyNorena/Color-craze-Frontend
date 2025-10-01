import { useState } from "react";
import type { avatar } from "../types/avatar";
import { useLateralMovement } from "../hooks/useLateralMovement"; 

const avatarInfo: Record<avatar, { image: string, color: string, top: string, left: string }> = {
    avatar1: {
        image: "src/assets/avatar1.png",
        color: "#fcaf01",
        top: "10%",
        left: "20%"
    },
    avatar2: {
        image: "src/assets/avatar2.png",
        color: "#fb038e",
        top: "10%",
        left: "80%"
    },
    avatar3: {
        image: "src/assets/avatar3.png",
        color: "#7304d7",
        top: "80%",
        left: "20%"
    },
    avatar4: {
        image: "src/assets/avatar4.png",
        color: "#77c914",
        top: "80%",
        left: "80%"
    },
};

const avatars: avatar[] = ["avatar1", "avatar2", "avatar3", "avatar4"];

interface AvatarProps {
    size?: number; // Tamaño en pixeles
    gameBoard?: {  // TAMAÑO DEL TABLERO, REVISAR UBICACION
        width: number;
        height: number;
    };
}

export const Avatar: React.FC<AvatarProps> = ({
    size = 60,
    gameBoard = { width: 800, height: 600 } // ← tablero por default
}) => {
    const randomIndex = Math.floor(Math.random() * avatars.length);
    const [avatar, setAvatar] = useState<avatar>(avatars[randomIndex]);
    const info = avatarInfo[avatar];

    // Hook movimiento
    const { position, velocity } = useLateralMovement({
        initialPosition: { 
            x: gameBoard.width / 2, // ← Posición inicial CENTRO
            y: gameBoard.height / 2 
        },
        speed: 5,
        boundaries: {  // ← Límites basados en el tablero
            left: 0,
            right: gameBoard.width - size, // Considerar tamaño del avatar
            top: 0,
            bottom: gameBoard.height - size
        }
    });

    return (
        <div
            style={{
                width: size,
                height: size,
                overflow: "hidden",
                //border: `3px solid ${info.color}`,
                position: "absolute", 
                top: position.y, // Usar posición del hook
                left: position.x,     
                transition: "left 0.1s ease, top 0.1s ease", // ← Suavizar movimiento
                transform: `translate(-50%, -50%) scaleX(${velocity.x > 0 ? 1 : -1})`
            }}
        >
            <img
                src={info.image}
                style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    filter: velocity.x !== 0 ? "brightness(1.1)" : "none"
                }}
            />
        </div>
    );
};