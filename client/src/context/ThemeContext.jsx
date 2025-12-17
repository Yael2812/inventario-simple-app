// Contexto para manejar el modo claro/oscuro de la aplicación.
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Hook de conveniencia para consumir el contexto
export const useTheme = () => useContext(ThemeContext);

const THEME_KEY = "inventario-theme";

export const ThemeProvider = ({ children }) => {
  // Intentamos leer el tema desde localStorage, si no, usamos 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem(THEME_KEY) || "light";
  });

  // Cada vez que cambie el tema, actualizamos el atributo de clase en <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Función para alternar entre claro y oscuro
  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
