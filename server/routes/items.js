// Rutas CRUD para artículos de inventario.
const express = require("express");
const { all, get, run } = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Listar artículos del usuario
router.get("/", async (req, res) => {
  try {
    const rows = await all(
      "SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ items: rows });
  } catch (err) {
    console.error("Error listando items", err);
    res.status(500).json({ message: "Error al obtener los artículos." });
  }
});

// Crear artículo
router.post("/", async (req, res) => {
  try {
    const { name, code, categoryId, quantity, status } = req.body;

    if (!name || !code) {
      return res
        .status(400)
        .json({ message: "Nombre y código del artículo son obligatorios." });
    }

    const result = await run(
      `INSERT INTO items (name, code, category_id, quantity, status, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        code,
        categoryId || null,
        quantity || 0,
        status || "in_stock",
        req.user.id
      ]
    );

    const item = await get("SELECT * FROM items WHERE id = ?", [
      result.lastID
    ]);

    res.status(201).json({ item });
  } catch (err) {
    console.error("Error creando item", err);
    res.status(500).json({ message: "Error al crear el artículo." });
  }
});

// Actualizar artículo
router.put("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const { name, code, categoryId, quantity, status } = req.body;

    await run(
      `UPDATE items
       SET name = ?, code = ?, category_id = ?, quantity = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [
        name,
        code,
        categoryId || null,
        quantity || 0,
        status || "in_stock",
        itemId,
        req.user.id
      ]
    );

    const item = await get("SELECT * FROM items WHERE id = ?", [itemId]);

    res.json({ item });
  } catch (err) {
    console.error("Error actualizando item", err);
    res.status(500).json({ message: "Error al actualizar el artículo." });
  }
});

// Eliminar artículo
router.delete("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    await run("DELETE FROM items WHERE id = ? AND user_id = ?", [
      itemId,
      req.user.id
    ]);
    res.json({ message: "Artículo eliminado." });
  } catch (err) {
    console.error("Error eliminando item", err);
    res.status(500).json({ message: "Error al eliminar el artículo." });
  }
});

// Exportar artículos a CSV
router.get("/export/csv", async (req, res) => {
  try {
    const rows = await all(
      "SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    // Construimos manualmente un CSV simple
    const headers = [
      "id",
      "name",
      "code",
      "category_id",
      "quantity",
      "status",
      "created_at",
      "updated_at"
    ];
    const escape = (value) =>
      typeof value === "string"
        ? `"${value.replace(/"/g, '""')}"`
        : value ?? "";

    const csvLines = [
      headers.join(","),
      ...rows.map((row) =>
        headers.map((h) => escape(row[h])).join(",")
      )
    ];

    const csvContent = csvLines.join("\n");

    res.header("Content-Type", "text/csv");
    res.attachment("inventario.csv");
    res.send(csvContent);
  } catch (err) {
    console.error("Error exportando CSV", err);
    res.status(500).json({ message: "Error al exportar el CSV." });
  }
});

module.exports = router;
