const rawUrl = import.meta.env.VITE_API_URL || "https://sachi-ghani.vercel.app";
export const API_URL = rawUrl.replace(/\/$/, "");
