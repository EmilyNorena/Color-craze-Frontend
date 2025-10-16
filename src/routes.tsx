import { Routes, Route, Navigate } from "react-router-dom";
import { Login} from "./pages/LoginPage";
import { BoardPage } from "./pages/BoardPage";


export const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirecciones */}
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Rutas principales */}
      <Route path="/login" element={<Login />} />
      <Route path="/board" element={<>< BoardPage /></>} />
    </Routes>
  );
};
