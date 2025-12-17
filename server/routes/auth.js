// Rutas de autenticación: registro e inicio de sesión.
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { get, run } = require("../db");

const router = express.Router();

// Helper para crear token JWT
function createToken(user) {
  const payload = { id: user.id };
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

// Registro de nuevo usuario
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    const existing = await get("SELECT id FROM users WHERE email = ?", [
      email
    ]);
    if (existing) {
      return res
        .status(400)
        .json({ message: "Ya existe un usuario con ese correo." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const result = await run(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hash]
    );

    const user = { id: result.lastID, username, email };
    const token = createToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Error en registro", err);
    res.status(500).json({ message: "Error interno al registrar usuario." });
  }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    const token = createToken(user);

    res.json({
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (err) {
    console.error("Error en login", err);
    res.status(500).json({ message: "Error interno al iniciar sesión." });
  }
});

module.exports = router;
