import axios from "axios";

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

export type Color = "yellow" | "blue" | "green" | "gray";

export interface Category {
  id: string;
  name: string;
  color: Color;
}

export interface CreateCategoryDto {
  name: string;
  color: Color;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>("/categories");
    return data;
  },

  create: async (categoryData: CreateCategoryDto): Promise<Category> => {
    const { data } = await apiClient.post<Category>(
      "/categories",
      categoryData,
    );
    return data;
  },
};
