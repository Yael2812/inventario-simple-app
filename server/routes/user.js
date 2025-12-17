// Rutas relacionadas con el perfil del usuario autenticado.
const express = require("express");
const bcrypt = require("bcryptjs");
const { get, run } = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Todas estas rutas requieren autenticación
router.use(authMiddleware);

// Obtener perfil básico
router.get("/me", async (req, res) => {
  try {
    const user = await get(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    res.json({ user });
  } catch (err) {
    console.error("Error obteniendo perfil", err);
    res.status(500).json({ message: "Error al obtener el perfil." });
  }
});

// Actualizar nombre y correo
router.put("/me", async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Nombre y correo son obligatorios." });
    }

    // Verificar que el mail no esté usado por otro usuario
    const existing = await get(
      "SELECT id FROM users WHERE email = ? AND id <> ?",
      [email, req.user.id]
    );
    if (existing) {
      return res
        .status(400)
        .json({ message: "Ya existe otro usuario con ese correo." });
    }

    await run("UPDATE users SET username = ?, email = ? WHERE id = ?", [
      username,
      email,
      req.user.id
    ]);

    const updated = await get(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    res.json({ user: updated });
  } catch (err) {
    console.error("Error actualizando perfil", err);
    res.status(500).json({ message: "Error al actualizar el perfil." });
  }
});

// Cambiar contraseña
router.put("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await get("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      return res.status(400).json({ message: "La contraseña actual es incorrecta." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await run("UPDATE users SET password_hash = ? WHERE id = ?", [
      hash,
      req.user.id
    ]);

    res.json({ message: "Contraseña actualizada correctamente." });
  } catch (err) {
    console.error("Error cambiando contraseña", err);
    res.status(500).json({ message: "Error al cambiar la contraseña." });
  }
});

module.exports = router;
