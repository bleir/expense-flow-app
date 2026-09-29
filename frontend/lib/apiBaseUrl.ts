const PRODUCTION_API_URL = "https://expense-flow-app-backend.vercel.app";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  (process.env.GITHUB_PAGES === "true" ? PRODUCTION_API_URL : undefined);

export const API_URL = apiUrl || "http://localhost:3001";
