import axios, { type AxiosError } from "axios";

import { API_URL } from "@/lib/apiBaseUrl";

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

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ApiErrorBody>(error)) {
      error.message = getApiErrorMessage(error);
    }

    return Promise.reject(error);
  },
);
