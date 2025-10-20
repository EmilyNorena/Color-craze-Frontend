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

      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/rooms" element={<RoomPage />} />
      <Route path="/waitingroom" element={<WaitingRoomPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/board"
        element={
          <ProtectedRoute>
            <BoardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
