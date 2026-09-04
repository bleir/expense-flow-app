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

export interface Color {
  id: string;
  color: string;
  name: string;
}

export interface CreateColorDto {
  color: string;
  name: string;
}

export type UpdateColorDto = Partial<CreateColorDto>;

export const colorsApi = {
  getAll: async (): Promise<Color[]> => {
    const { data } = await apiClient.get<Color[]>(routes.colors);
    return data;
  },

  create: async (colorData: CreateColorDto): Promise<Color> => {
    const { data } = await apiClient.post<Color>(routes.colors, colorData);
    return data;
  },

  update: async (id: string, colorData: UpdateColorDto): Promise<Color> => {
    const { data } = await apiClient.patch<Color>(
      `${routes.colors}/${id}`,
      colorData,
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${routes.colors}/${id}`);
  },
};
