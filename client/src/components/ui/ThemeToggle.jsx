// Botón para alternar entre modo claro y oscuro utilizando el ThemeContext.
import React from "react";
import { useTheme } from "../../context/ThemeContext.jsx";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs sm:text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <span className="text-lg" aria-hidden="true">
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
      <span>{theme === "dark" ? "Modo oscuro" : "Modo claro"}</span>
    </button>
  );
};

export default ThemeToggle;
