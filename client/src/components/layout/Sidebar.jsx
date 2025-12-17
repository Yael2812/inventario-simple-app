// Sidebar de navegación lateral.
// En móviles se muestra como panel deslizable controlado por estado.
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import logo from "../../assets/logo.png";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Clases comunes para los enlaces
  const linkClasses = ({ isActive }) =>
    [
      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
      "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-300",
      isActive
        ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-300"
        : "text-gray-700 dark:text-gray-300"
    ].join(" ");

  return (
    <>
      {/* Fondo semitransparente en móvil cuando el sidebar está abierto */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo y nombre de la app */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
          <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            Inventario Simple
          </span>
        </div>

        {/* Navegación principal */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavLink to="/items" className={linkClasses} onClick={onClose}>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-300 text-lg">
              📦
            </span>
            <span>Gestión de Artículos</span>
          </NavLink>

          <NavLink to="/settings" className={linkClasses} onClick={onClose}>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-300 text-lg">
              ⚙️
            </span>
            <span>Ajustes de Usuario</span>
          </NavLink>
        </nav>

        {/* Zona inferior con botón de cierre de sesión */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-lg">
              ⏏
            </span>
            <span>Cerrar Sesión</span>
          </button>

          <p className="mt-3 text-xs text-gray-400">
            Tema actual:{" "}
            <span className="font-medium">
              {theme === "dark" ? "Oscuro" : "Claro"}
            </span>
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
