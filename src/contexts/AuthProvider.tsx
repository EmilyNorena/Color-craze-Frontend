import { useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import { login as loginService, guestLogin as guestLoginService } from "../services/authService";
import type { UserData } from "../types/user";
import type { JwtPayload } from "../types/jwtPayLoad";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!sessionStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(() => sessionStorage.getItem("role"));
  const [user, setUser] = useState<UserData | null>(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (err) {
        console.error("Token inválido al iniciar:", err);
        logout();
      }
    }
  }, []);

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
      sessionStorage.setItem("playerId", JSON.stringify(response.userData.id));
    } catch (err) {
      console.error("Token inválido:", err);
      logout();
      throw err;
    }
  };

  const guestLogin = async () => {
    const response = await guestLoginService();

    try {
      const decoded = jwtDecode<JwtPayload>(response.token);
      if (decoded.exp * 1000 < Date.now()) throw new Error("Token expirado");

      setIsAuthenticated(true);
      setRole(response.userData.role || "GUEST");
      setUser(response.userData);
      setToken(response.token);

      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("role", response.userData.role || "GUEST");
      sessionStorage.setItem("user", JSON.stringify(response.userData));
    } catch (err) {
      console.error("Token de invitado inválido:", err);
      logout();
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
    sessionStorage.removeItem("playerId");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        user,
        token,
        login,
        logout,
        guestLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
