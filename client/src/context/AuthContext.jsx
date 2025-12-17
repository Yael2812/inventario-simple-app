// Contexto para autenticar usuarios y compartir el estado entre componentes.
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "inventario-token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const isAuthenticated = Boolean(token);

  // Cargamos información básica del usuario al tener token
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        setLoadingUser(true);
        const res = await api.get("/user/me");
        setUser(res.data.user);
      } catch (err) {
        console.error("Error loading user profile", err);
        // Si falla el perfil, limpiamos token
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [token]);

  // Maneja el inicio de sesión
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    setUser(userData);
  };

  // Maneja el registro
  const register = async (username, email, password) => {
    const res = await api.post("/auth/register", {
      username,
      email,
      password
    });
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    setUser(userData);
  };

  // Cierra sesión completamente
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const value = {
    token,
    user,
    isAuthenticated,
    loadingUser,
    login,
    register,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
