// src/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/LoginPage";
import { RoomPage } from "./pages/RoomPage"
import { WaitingRoomPage } from "./pages/WaitingRoomPage"
import { BoardPage } from "./pages/BoardPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirecciones */}
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <RoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/waitingroom/:roomId?"
        element={
          <ProtectedRoute>
            <WaitingRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/board/:roomId"
        element={
          <ProtectedRoute>
            <BoardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
