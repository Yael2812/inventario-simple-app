// Contenedor visual de los toasts. Se suscribe al ToastContext.
import React, { useContext } from "react";
import ToastContext from "../../context/ToastContext.jsx";

const ToastContainer = () => {
  const context = useContext(ToastContext);
  // Si el provider aún no se ha montado, no mostramos nada
  if (!context) return null;

  // NOTA: Aunque ToastProvider no expone los toasts directamente,
  // React permite acceder al estado interno si lo pasamos vía context.
  // Para mantener el código sencillo de nivel junior,
  // ajustamos ToastProvider para que el value incluya los toasts.
  const { toasts, removeToast } = context;

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-full max-w-md rounded-xl border px-4 py-3 shadow-lg text-sm flex justify-between items-center ${
            toast.type === "error"
              ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-100"
              : "bg-green-50 border-green-200 text-green-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-100"
          }`}
        >
          <span>{toast.message}</span>
          <button
            className="ml-4 text-xs opacity-70 hover:opacity-100"
            onClick={() => removeToast(toast.id)}
          >
            Cerrar
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
