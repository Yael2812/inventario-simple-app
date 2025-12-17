// Página principal de gestión de artículos.
import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";
import ItemFormModal from "../components/modals/ItemFormModal.jsx";
import ConfirmModal from "../components/modals/ConfirmModal.jsx";
import CategoriesModal from "../components/modals/CategoriesModal.jsx";
import { useToast } from "../context/ToastContext.jsx";

const STATUS_LABELS = {
  in_stock: { text: "En Stock", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100" },
  low_stock: { text: "Bajo Stock", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-100" },
  out_of_stock: { text: "Agotado", color: "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-100" }
};

const ItemsPage = () => {
  const { addToast } = useToast();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  // Cargar artículos y categorías al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsRes, catRes] = await Promise.all([
          api.get("/items"),
          api.get("/categories")
        ]);
        setItems(itemsRes.data.items);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error(err);
        addToast("Error al cargar artículos.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addToast]);

  // Filtrar los artículos según búsqueda, categoría y estado
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "all" ||
        (item.category_id && String(item.category_id) === filterCategory);

      const matchesStatus =
        filterStatus === "all" || item.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, filterCategory, filterStatus]);

  // Abrir modal de nuevo artículo
  const openNewItemModal = () => {
    setEditingItem(null);
    setItemModalOpen(true);
  };

  // Guardar artículo (crear o editar)
  const handleSaveItem = async (form) => {
    try {
      if (form.id) {
        const res = await api.put(`/items/${form.id}`, form);
        setItems((prev) =>
          prev.map((item) => (item.id === form.id ? res.data.item : item))
        );
        addToast("Artículo actualizado correctamente.");
      } else {
        const res = await api.post("/items", form);
        setItems((prev) => [...prev, res.data.item]);
        addToast("Artículo creado correctamente.");
      }
      setItemModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast("No se pudo guardar el artículo.", "error");
    }
  };

  // Confirmar eliminación
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/items/${itemToDelete.id}`);
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      addToast("Artículo eliminado correctamente.");
    } catch (err) {
      console.error(err);
      addToast("No se pudo eliminar el artículo.", "error");
    } finally {
      setConfirmDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  // CRUD de categorías desde el modal
  const handleCreateCategory = async (name) => {
    try {
      const res = await api.post("/categories", { name });
      setCategories((prev) => [...prev, res.data.category]);
      addToast("Categoría creada.");
    } catch (err) {
      console.error(err);
      addToast("No se pudo crear la categoría.", "error");
    }
  };

  const handleUpdateCategory = async (id, name) => {
    try {
      const res = await api.put(`/categories/${id}`, { name });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? res.data.category : c))
      );
      addToast("Categoría actualizada.");
    } catch (err) {
      console.error(err);
      addToast("No se pudo actualizar la categoría.", "error");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      // También limpiamos las referencias de artículos
      setItems((prev) =>
        prev.map((item) =>
          item.category_id === id ? { ...item, category_id: null } : item
        )
      );
      addToast("Categoría eliminada.");
    } catch (err) {
      console.error(err);
      addToast("No se pudo eliminar la categoría.", "error");
    }
  };

  // Exportar CSV
  const handleExportCsv = async () => {
    try {
      const res = await api.get("/items/export/csv", {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "inventario.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      addToast("Exportación CSV generada.");
    } catch (err) {
      console.error(err);
      addToast("No se pudo exportar el CSV.", "error");
    }
  };

  // Helper para obtener nombre de categoría
  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "-";
  };

  return (
    <div className="py-6">
      {/* Encabezado y acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Gestión de Artículos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Administra tus productos, cantidades y estados de stock.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoriesModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <span>⚙️</span>
            <span>Categorías</span>
          </button>
          <button
            type="button"
            onClick={openNewItemModal}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <span>＋</span>
            <span>Añadir Artículo</span>
          </button>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre, código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="in_stock">En Stock</option>
            <option value="low_stock">Bajo Stock</option>
            <option value="out_of_stock">Agotado</option>
          </select>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            ⬇ Exportar CSV
          </button>
        </div>
      </div>

      {/* Tabla de artículos, con scroll horizontal en móviles */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3 font-medium">
                  <input type="checkbox" disabled />
                </th>
                <th className="px-4 py-3 font-medium">Nombre del Artículo</th>
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium text-right">Cantidad</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredItems.map((item) => {
                const statusInfo = STATUS_LABELS[item.status] || {
                  text: item.status,
                  color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                };
                return (
                  <tr key={item.id} className="text-gray-800 dark:text-gray-100">
                    <td className="px-4 py-3">
                      <input type="checkbox" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.code}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getCategoryName(item.category_id)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => {
                            setEditingItem(item);
                            setItemModalOpen(true);
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="p-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950"
                          onClick={() => confirmDelete(item)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {loading
                      ? "Cargando artículos..."
                      : "No se encontraron artículos con los filtros actuales."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ItemFormModal
        open={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSubmit={handleSaveItem}
        categories={categories}
        initialItem={editingItem}
      />

      <ConfirmModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Eliminar artículo"
        description="¿Seguro que deseas eliminar este artículo? Esta acción no se puede deshacer."
        onConfirm={handleDeleteItem}
      />

      <CategoriesModal
        open={categoriesModalOpen}
        onClose={() => setCategoriesModalOpen(false)}
        categories={categories}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
};

export default ItemsPage;
