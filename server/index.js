// Punto de entrada del backend Express.
// Inicia el servidor, configura middlewares y monta las rutas.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/categories");
const itemRoutes = require("./routes/items");

const app = express();
const PORT = process.env.PORT || 4000;

// Inicializamos la base de datos y tablas
initDb();

// Middlewares globales
const allowedOrigins = [
  "http://localhost:5173",                  // Frontend local (Vite)
  "https://inventario-simple-app.vercel.app" // Frontend en Vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requests sin origin (Postman, curl, healthchecks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    }
    // credentials NO es necesario porque usas JWT por header
  })
);

// Preflight
app.options("*", cors());

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);

// Healthcheck simple
app.get("/", (req, res) => {
  res.send("Backend de Inventario Simple funcionando.");
});

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
