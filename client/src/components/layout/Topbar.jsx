// Barra superior que muestra el título de la sección y controles como el toggle de tema.
import React from "react";
import { useLocation } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle.jsx";

const Topbar = ({ onToggleSidebar }) => {
  const location = useLocation();

  // Título dinámico según la ruta actual
  const getTitle = () => {
    if (location.pathname.startsWith("/items")) return "Gestión de Artículos";
    if (location.pathname.startsWith("/settings")) return "Ajustes de Usuario";
    return "Inventario Simple";
  };

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur">
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa visible sólo en pantallas pequeñas */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Abrir menú</span>
          ☰
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-50">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Toggle de tema claro/oscuro */}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Topbar;
