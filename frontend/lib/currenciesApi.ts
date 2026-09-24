import { routes } from "@/constants";
import { createCrudApi } from "@/lib/createCrudApi";

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

export const currenciesApi = createCrudApi<Currency, CreateCurrencyDto>(
  routes.currencies,
);
