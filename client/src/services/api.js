// Cliente Axios configurado para comunicarse con el backend Express.
import axios from "axios";

// En Vite, las variables públicas deben empezar con VITE_
// En local se toma desde client/.env, en producción desde Vercel.
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("Falta definir VITE_API_URL (ver client/.env.example)");
}

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Interceptor para adjuntar automáticamente el token JWT si existe
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("inventario-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
