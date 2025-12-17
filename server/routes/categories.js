// Rutas CRUD para categorías de inventario.
const express = require("express");
const { all, get, run } = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Listar categorías del usuario
router.get("/", async (req, res) => {
  try {
    const rows = await all(
      "SELECT id, name, user_id FROM categories WHERE user_id = ? ORDER BY name ASC",
      [req.user.id]
    );
    res.json({ categories: rows });
  } catch (err) {
    console.error("Error listando categorías", err);
    res.status(500).json({ message: "Error al obtener las categorías." });
  }
});

// Crear categoría
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "El nombre de la categoría es obligatorio." });
    }

    const result = await run(
      "INSERT INTO categories (name, user_id) VALUES (?, ?)",
      [name, req.user.id]
    );

    const category = await get(
      "SELECT id, name, user_id FROM categories WHERE id = ?",
      [result.lastID]
    );

    res.status(201).json({ category });
  } catch (err) {
    console.error("Error creando categoría", err);
    res.status(500).json({ message: "Error al crear la categoría." });
  }
});

// Actualizar categoría
router.put("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;
    await run(
      "UPDATE categories SET name = ? WHERE id = ? AND user_id = ?",
      [name, categoryId, req.user.id]
    );
    const category = await get(
      "SELECT id, name, user_id FROM categories WHERE id = ?",
      [categoryId]
    );
    res.json({ category });
  } catch (err) {
    console.error("Error actualizando categoría", err);
    res.status(500).json({ message: "Error al actualizar la categoría." });
  }
});

// Eliminar categoría
router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    await run("DELETE FROM categories WHERE id = ? AND user_id = ?", [
      categoryId,
      req.user.id
    ]);
    res.json({ message: "Categoría eliminada." });
  } catch (err) {
    console.error("Error eliminando categoría", err);
    res.status(500).json({ message: "Error al eliminar la categoría." });
  }
});

module.exports = router;
