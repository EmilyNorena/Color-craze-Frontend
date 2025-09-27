import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/LoginPage.tsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};
