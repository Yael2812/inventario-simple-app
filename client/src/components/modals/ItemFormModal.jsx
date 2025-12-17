// Modal reutilizable para crear o editar un artículo.
import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal.jsx";

const defaultItem = {
  name: "",
  code: "",
  categoryId: "",
  quantity: 0,
  status: "in_stock"
};

const ItemFormModal = ({ open, onClose, onSubmit, categories, initialItem }) => {
  const [form, setForm] = useState(defaultItem);

  useEffect(() => {
    if (initialItem) {
      setForm({
        id: initialItem.id,
        name: initialItem.name,
        code: initialItem.code,
        categoryId: initialItem.category_id?.toString() || "",
        quantity: initialItem.quantity,
        status: initialItem.status
      });
    } else {
      setForm(defaultItem);
    }
  }, [initialItem, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal
      title={initialItem ? "Editar Artículo" : "Añadir Artículo"}
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Nombre del Artículo
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Laptop Pro 15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Código
            </label>
            <input
              type="text"
              name="code"
              required
              value={form.code}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. LP15-2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Categoría
            </label>
            <select
              name="categoryId"
              required
              value={form.categoryId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              name="quantity"
              min={0}
              value={form.quantity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Estado
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="status"
                  value="in_stock"
                  checked={form.status === "in_stock"}
                  onChange={handleChange}
                />
                <span>En Stock</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="status"
                  value="low_stock"
                  checked={form.status === "low_stock"}
                  onChange={handleChange}
                />
                <span>Bajo Stock</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="status"
                  value="out_of_stock"
                  checked={form.status === "out_of_stock"}
                  onChange={handleChange}
                />
                <span>Agotado</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            {initialItem ? "Guardar Cambios" : "Añadir Artículo"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ItemFormModal;
