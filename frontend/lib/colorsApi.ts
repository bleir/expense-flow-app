import { routes } from "@/constants";
import { createCrudApi } from "@/lib/createCrudApi";

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

export const colorsApi = createCrudApi<Color, CreateColorDto>(routes.colors);
