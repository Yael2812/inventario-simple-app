// Modal para gestionar categorías básicas de inventario.
import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal.jsx";

const CategoriesModal = ({
  open,
  onClose,
  categories,
  onCreate,
  onUpdate,
  onDelete
}) => {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setEditingId(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingId) {
      onUpdate(editingId, name.trim());
    } else {
      onCreate(name.trim());
    }
    setName("");
    setEditingId(null);
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
  };

  return (
    <Modal title="Categorías" onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-4">
        {/* Formulario simple en la parte superior */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre de la categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            {editingId ? "Guardar" : "Añadir"}
          </button>
        </form>

        {/* Listado de categorías existentes */}
        <ul className="divide-y divide-gray-200 dark:divide-gray-800 max-h-64 overflow-y-auto">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between py-2 text-sm"
            >
              <span className="text-gray-800 dark:text-gray-100">
                {cat.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-2 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => startEdit(cat)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950"
                  onClick={() => onDelete(cat.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}

          {categories.length === 0 && (
            <li className="py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              No hay categorías aún. Crea una nueva arriba.
            </li>
          )}
        </ul>
      </div>
    </Modal>
  );
};

export default CategoriesModal;
