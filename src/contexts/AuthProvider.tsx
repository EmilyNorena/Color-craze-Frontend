import { useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import { login as loginService } from "../services/authService";
import type { UserData } from "../types/user";
import type { JwtPayload } from "../types/jwtPayLoad";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await loginService(email, password);
    try {
      const decoded = jwtDecode<JwtPayload>(response.token);
      if (decoded.exp * 1000 < Date.now()) throw new Error("Token expirado");

      setIsAuthenticated(true);
      setRole(response.userData.role);
      setUser(response.userData);
      setToken(response.token);

      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("refreshToken", response.refreshToken);
      sessionStorage.setItem("role", response.userData.role);
      sessionStorage.setItem("user", JSON.stringify(response.userData));
    } catch (err) {
      console.error("Token inválido:", err);
      setIsAuthenticated(false);
      setRole(null);
      setUser(null);
      setToken(null);
      throw err;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    setToken(null);

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
