// Componente raíz de la aplicación.
// Define las rutas principales y aplica el layout adecuado según si el usuario está autenticado.
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ItemsPage from "./pages/ItemsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import ToastContainer from "./components/ui/ToastContainer.jsx";

const App = () => {
  // Obtenemos el estado de autenticación desde el contexto
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Componente global para mostrar notificaciones tipo toast */}
      <ToastContainer />

      <Routes>
        {/* Rutas públicas de autenticación */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/items" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/items" /> : <RegisterPage />}
        />

        {/* Rutas privadas, envueltas en el layout principal */}
        <Route
          path="/"
          element={
            isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="/items" replace />} />
          <Route path="items" element={<ItemsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Cualquier ruta desconocida nos redirige según el estado */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/items" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
