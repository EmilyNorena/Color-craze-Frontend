// AuthProvider.tsx - VERSIÓN COMPATIBLE CON STRICT MODE
import { useState, useEffect, type ReactNode, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import { login as loginService, guestLogin as guestLoginService } from "../services/authService";
import type { UserData } from "../types/user";
import type { JwtPayload } from "../types/jwtPayLoad";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [, setLoading] = useState(true);
  
  const initialized = useRef(false);

  useEffect(() => {
    // Si ya se inicializó, no hacer nada
    if (initialized.current) {
      console.log("🔄 AuthProvider: Already initialized, skipping...");
      setLoading(false);
      return;
    }

    console.log("🚀 AuthProvider: Initializing authentication...");
    initialized.current = true;

    const initializeAuth = () => {
      const savedToken = sessionStorage.getItem("token");
      const savedUser = sessionStorage.getItem("user");
      const savedRole = sessionStorage.getItem("role");

      console.log("📦 AuthProvider: Checking stored auth data...", {
        hasToken: !!savedToken,
        hasUser: !!savedUser,
        hasRole: !!savedRole
      });

      if (savedToken && savedUser) {
        try {
          const decoded = jwtDecode<JwtPayload>(savedToken);
          const isTokenValid = decoded.exp * 1000 > Date.now();

          console.log("⏰ AuthProvider: Token validation", {
            expiration: new Date(decoded.exp * 1000),
            now: new Date(),
            isValid: isTokenValid
          });

          if (isTokenValid) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setRole(savedRole);
            setIsAuthenticated(true);
            console.log("✅ AuthProvider: User authenticated successfully");
          } else {
            console.log("❌ AuthProvider: Token expired");
            clearAuth();
          }
        } catch (error) {
          console.error("❌ AuthProvider: Invalid token", error);
          clearAuth();
        }
      } else {
        console.log("ℹ️ AuthProvider: No authentication data found");
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []); // Empty dependency array - solo se ejecuta una vez

  const clearAuth = () => {
    console.log("🧹 AuthProvider: Clearing authentication data");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("playerId");
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    setToken(null);
  };

  const login = async (email: string, password: string) => {
    console.log("🔑 AuthProvider: Starting login...");
    const response = await loginService(email, password);

    try {
      const decoded = jwtDecode<JwtPayload>(response.token);
      
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }

      // Actualizar estado
      setToken(response.token);
      setUser(response.userData);
      setRole(response.userData.role);
      setIsAuthenticated(true);

      // Guardar en sessionStorage
      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("refreshToken", response.refreshToken);
      sessionStorage.setItem("role", response.userData.role);
      sessionStorage.setItem("user", JSON.stringify(response.userData));
      sessionStorage.setItem("playerId", response.userData.id);

      console.log("✅ AuthProvider: Login completed successfully");
    } catch (err) {
      console.error("❌ AuthProvider: Login failed", err);
      clearAuth();
      throw err;
    }
  };

  const guestLogin = async () => {
    console.log("🎭 AuthProvider: Starting guest login...");
    const response = await guestLoginService();

    try {
      const decoded = jwtDecode<JwtPayload>(response.token);
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }

      setToken(response.token);
      setUser(response.userData);
      setRole(response.userData.role || "GUEST");
      setIsAuthenticated(true);

      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("role", response.userData.role || "GUEST");
      sessionStorage.setItem("user", JSON.stringify(response.userData));

      console.log("✅ AuthProvider: Guest login completed successfully");
    } catch (err) {
      console.error("❌ AuthProvider: Guest login failed", err);
      clearAuth();
      throw err;
    }
  };

  const logout = () => {
    console.log("🚪 AuthProvider: Logging out...");
    clearAuth();
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