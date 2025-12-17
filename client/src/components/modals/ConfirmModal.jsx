// Modal de confirmación simple para acciones destructivas como eliminar.
import React from "react";
import Modal from "../ui/Modal.jsx";

const ConfirmModal = ({ open, onClose, title, description, onConfirm }) => {
  if (!open) return null;

  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        {description}
      </p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
