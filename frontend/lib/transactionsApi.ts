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

export type TransactionType = "income" | "expense";

export interface TransactionCategory {
  id: string;
  name: string;
  color: string;
}

export interface Transaction {
  id: string;
  categoryId?: string;
  category?: TransactionCategory;
  type: TransactionType;
  amount: string;
  description: string;
  date: Date | string;
  notes?: string | null;
}

export interface CreateTransactionDto {
  categoryId: string;
  type: TransactionType;
  amount: string;
  description: string;
  date: string;
  notes?: string | null;
}

export type UpdateTransactionDto = Partial<CreateTransactionDto>;

export const transactionsApi = {
  getAll: async (params?: { limit?: number }): Promise<Transaction[]> => {
    const { data } = await apiClient.get<Transaction[]>(routes.transactions, {
      params,
    });
    return data;
  },

  create: async (
    transactionData: CreateTransactionDto,
  ): Promise<Transaction> => {
    const { data } = await apiClient.post<Transaction>(
      routes.transactions,
      transactionData,
    );
    return data;
  },

  update: async (
    id: string,
    transactionData: UpdateTransactionDto,
  ): Promise<Transaction> => {
    const { data } = await apiClient.patch<Transaction>(
      `${routes.transactions}/${id}`,
      transactionData,
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${routes.transactions}/${id}`);
  },
};
