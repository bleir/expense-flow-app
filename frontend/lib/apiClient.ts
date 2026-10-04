import axios, { type AxiosError } from "axios";

import { API_URL } from "@/lib/apiBaseUrl";
import { AUTH_STORAGE_KEY } from "@/lib/authStorage";

type ApiErrorBody = {
  message?: string | string[];
};

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

function getApiErrorMessage(error: AxiosError<ApiErrorBody>) {
  const apiMessage = error.response?.data?.message;

  if (Array.isArray(apiMessage)) {
    const message = apiMessage.filter(Boolean).join(", ");
    if (message) {
      return message;
    }
  }

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  return error.message || "Request failed";
}

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return config;

  try {
    const { accessToken } = JSON.parse(raw) as { accessToken?: string };
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch {
    // A broken session blob stays anonymous instead of failing every request.
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ApiErrorBody>(error)) {
      error.message = getApiErrorMessage(error);
    }

    return Promise.reject(error);
  },
);
