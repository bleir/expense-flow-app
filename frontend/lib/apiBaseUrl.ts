const PRODUCTION_API_URL = "https://expense-flow-app-backend.vercel.app";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  (process.env.NODE_ENV === "production"
    ? PRODUCTION_API_URL
    : "http://localhost:3001");
