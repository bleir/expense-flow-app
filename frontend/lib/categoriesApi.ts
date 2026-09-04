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

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>(routes.categories);
    return data;
  },

  create: async (categoryData: CreateCategoryDto): Promise<Category> => {
    const { data } = await apiClient.post<Category>(
      routes.categories,
      categoryData,
    );
    return data;
  },

  update: async (
    id: string,
    categoryData: UpdateCategoryDto,
  ): Promise<Category> => {
    const { data } = await apiClient.patch<Category>(
      `${routes.categories}/${id}`,
      categoryData,
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${routes.categories}/${id}`);
  },
};
