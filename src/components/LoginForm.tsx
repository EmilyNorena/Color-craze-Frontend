import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { isAxiosError } from "axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, guestLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/board");
    } catch (err: unknown) {
      console.error("Error en login:", err);

      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Credenciales incorrectas o error en el servidor. Inténtalo de nuevo."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Credenciales incorrectas o error en el servidor. Inténtalo de nuevo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await guestLogin();
      navigate("/board");
    } catch (err) {
      console.error("Error en login invitado:", err);
      setError("No se pudo iniciar sesión como invitado. Inténtalo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-card">
      <div className="text-center mb-6">
        <h2 className="text-[20px] font-bold mt-4 text-white">
          Inicio de Sesión
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-1 p-2">
          <label
            htmlFor="email"
            className="block mb-1 text-[#ffffff] font-bold text-[15px]"
          >
            Correo
          </label>
          <input
            className="w-full p-3 border border-[#bdc3c7] text-base text-[#000000] rounded-lg"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@mail.escuela.edu.co"
            required
          />
        </div>

        <div className="mb-8 p-2">
          <label
            htmlFor="password"
            className="block mb-1 text-[#ffffff] font-bold text-[15px]"
          >
            Contraseña
          </label>
          <input
            className="w-full p-3 border border-[#bdc3c7] rounded-lg text-base text-[#000000]"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        {error && (
          <p className="mb-4 text-center text-red-200 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-950 text-lg w-full p-3 rounded-lg font-medium hover:bg-opacity-90 transition"
        >
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleGuestLogin}
          className="mt-3 bg-gray-700 text-lg w-full p-3 rounded-lg font-medium hover:bg-opacity-90 transition"
        >
          {isLoading ? "Cargando..." : "Entrar como invitado"}
        </button>

        <div className="mt-6 text-center">
          <Link
            to="/forgot-password"
            className="text-xs sm:text-base text-[#7aa6ff]"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
