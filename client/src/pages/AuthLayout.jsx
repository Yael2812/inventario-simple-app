// Layout compartido entre las pantallas de Login y Registro.
// Reproduce el diseño centrado con tarjeta y pestañas.
import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

const AuthLayout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Inventario Simple
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
          {/* Tabs de navegación entre login y registro */}
          <div className="flex mb-6 rounded-full bg-gray-100 dark:bg-gray-900 p-1 text-sm">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                [
                  "flex-1 text-center py-2 rounded-full transition-colors",
                  isActive
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                ].join(" ")
              }
            >
              Iniciar Sesión
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                [
                  "flex-1 text-center py-2 rounded-full transition-colors",
                  isActive
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                ].join(" ")
              }
            >
              Regístrate
            </NavLink>
          </div>

          {children}
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Tema actual:{" "}
          <span className="font-medium">
            {theme === "dark" ? "Oscuro" : "Claro"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
