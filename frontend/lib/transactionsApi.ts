import { routes } from "@/constants";
import { createCrudApi } from "@/lib/createCrudApi";

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

export const transactionsApi = createCrudApi<Transaction, CreateTransactionDto>(
  routes.transactions,
);
