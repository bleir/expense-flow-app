import { routes } from "@/constants";
import { createCrudApi } from "@/lib/createCrudApi";

export interface Category {
  id: string;
  name: string;
  color: string;
  monthlyBudget?: string | null;
}

export interface CreateCategoryDto {
  name: string;
  color: string;
  monthlyBudget?: string | null;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export const categoriesApi = createCrudApi<Category, CreateCategoryDto>(
  routes.categories,
);
