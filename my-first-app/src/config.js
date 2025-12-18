const rawUrl = import.meta.env.VITE_API_URL || "https://sachi-ghani-backend.onrender.com";
export const API_URL = rawUrl.replace(/\/$/, "");
