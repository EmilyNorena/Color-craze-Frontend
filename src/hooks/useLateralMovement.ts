// hooks/useLateralMovement.ts
import { useState, useEffect, useRef } from 'react';

interface MovementState {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    isGrounded: boolean; // Conectado a tierra?
}

interface UseLateralMovementProps {
    initialPosition?: { x: number; y: number };
    speed?: number;
    boundaries?: { //Limites, inicialmente solo el tablero
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
}

export const useLateralMovement = ({
    initialPosition = { x: 0, y: 0 },
    speed = 5,
    boundaries
}: UseLateralMovementProps = {}) => {

    const [movement, setMovement] = useState<MovementState>({ //Inicialización de MovementState
        position: initialPosition,
        velocity: { x: 0, y: 0 },
        isGrounded: true
    });

    const keys = useRef({
        left: false,
        right: false,
        up: false
    });

    // Deteccion de teclas
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') keys.current.left = true;
            if (e.key === 'ArrowRight') keys.current.right = true;
            // if (e.key === ' ' || e.key === 'Spacebar') keys.current.space = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') keys.current.left = false;
            if (e.key === 'ArrowRight') keys.current.right = false;
            // if (e.key === ' ' || e.key === 'Spacebar') keys.current.space = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => { //Limpiar
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const gameLoop = setInterval(() => {
            setMovement(prev => {
                // Movimiento lateral
                let newVelocityX = 0;
                if (keys.current.left) newVelocityX = -speed;
                if (keys.current.right) newVelocityX = speed;

                let newX = prev.position.x + newVelocityX;
                let newY = prev.position.y;

                // Limites basicos
                if (boundaries) {
                    newX = Math.max(boundaries.left, Math.min(boundaries.right, newX));
                    newY = Math.max(boundaries.top, Math.min(boundaries.bottom, newY));
                }

                return {
                    position: { x: newX, y: newY },
                    velocity: { x: newVelocityX, y: 0 }, // ← y siempre 0, sin gravedad
                    isGrounded: true // sin gravedad aun
                };
            });
        }, 16); //Se ejecuta cada 16 ms, 60fps

        return () => clearInterval(gameLoop);
    }, [speed, boundaries]);

    return {
        position: movement.position,
        velocity: movement.velocity,
        isGrounded: movement.isGrounded,
        setPosition: (pos: { x: number; y: number }) =>
            setMovement(prev => ({ ...prev, position: pos }))
    };
};