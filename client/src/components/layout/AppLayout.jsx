// Layout principal de la aplicación autenticada.
// Contiene el sidebar, el header superior y un Outlet para el contenido.
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const AppLayout = () => {
  // Estado para controlar el sidebar en pantallas pequeñas
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar en desktop */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior con botón hamburguesa en móvil */}
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Contenido desplazable */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
