// Middleware para validar el token JWT en las rutas protegidas.
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No se proporcionó token." });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Token inválido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    // Adjuntamos la info del usuario al request
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error("Error verificando token", err);
    return res.status(401).json({ message: "Token no válido." });
  }
}

module.exports = authMiddleware;
