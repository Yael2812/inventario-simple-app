Proyecto: Inventario Simple (Full Stack - React + Vite + Node + Express + SQLite)

Estructura:
- client: Frontend en React + Vite + Tailwind CSS.
- server: Backend en Node.js + Express + SQLite.

Instrucciones rápidas de uso:

1) Backend
---------
cd server
cp .env.example .env
# (Opcional) editar .env si deseas cambiar puerto o ruta de la base de datos
npm install
npm run dev

El backend se levantará por defecto en http://localhost:4000

2) Frontend
-----------
cd client
npm install
npm run dev

El frontend se levantará por defecto en http://localhost:5173

Asegúrate de que ambos (client y server) estén corriendo al mismo tiempo.

Características:
- Autenticación con registro e inicio de sesión.
- Gestión de artículos con CRUD completo.
- Gestión de categorías mediante modal.
- Exportación de artículos a CSV.
- Ajustes de usuario (nombre, correo, contraseña).
- Layout responsivo con sidebar colapsable en móviles.
- Soporte de modo claro/oscuro con toggle global.
- Notificaciones tipo toast para feedback al usuario.

Este código está pensado para ser comprensible y modificable por un desarrollador Junior.
Incluye comentarios en las secciones principales para guiar la lectura.
