import axios from "axios";

// Client build
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request handler
apiClient.interceptors.request.use(
  (config) => {
    // 1️⃣ Agregar token si existe
    const token = sessionStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2️⃣ Agregar correlationId
    let correlationId = sessionStorage.getItem("correlationId");
    if (!correlationId) {
      correlationId = crypto.randomUUID();
      sessionStorage.setItem("correlationId", correlationId);
    }
    config.headers["X-Correlation-ID"] = correlationId;

    // 3️⃣ PRINT PARA DEBUG
    console.log("[DEBUG] Axios request headers:", config.headers);

    return config;
  },
  (error) => Promise.reject(error)
);


// Response handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("No autorizado. Redirigiendo al login...");
      sessionStorage.removeItem("token"); 
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
