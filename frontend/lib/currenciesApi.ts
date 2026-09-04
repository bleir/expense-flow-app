import axios from "axios";
import { routes } from "@/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error: ", error.response);
    return Promise.reject(error);
  },
);

export interface Currency {
  id: string;
  code: string;
  currency: string;
  symbol: string;
  isActive: boolean;
}

export interface CreateCurrencyDto {
  code: string;
  currency: string;
  symbol: string;
  isActive: boolean;
}

export type UpdateCurrencyDto = Partial<CreateCurrencyDto>;

export const currenciesApi = {
  getAll: async (): Promise<Currency[]> => {
    const { data } = await apiClient.get<Currency[]>(routes.currencies);
    return data;
  },

  create: async (currencyData: CreateCurrencyDto): Promise<Currency> => {
    const { data } = await apiClient.post<Currency>(
      routes.currencies,
      currencyData,
    );
    return data;
  },

  update: async (
    id: string,
    currencyData: UpdateCurrencyDto,
  ): Promise<Currency> => {
    const { data } = await apiClient.patch<Currency>(
      `${routes.currencies}/${id}`,
      currencyData,
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${routes.currencies}/${id}`);
  },
};
