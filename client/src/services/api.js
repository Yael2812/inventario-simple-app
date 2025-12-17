// Cliente Axios configurado para comunicarse con el backend Express.
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
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
