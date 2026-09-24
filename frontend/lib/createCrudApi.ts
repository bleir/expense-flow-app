import { apiClient } from "@/lib/apiClient";

export function createCrudApi<T, CreateDto, UpdateDto = Partial<CreateDto>>(
  path: string,
) {
  return {
    // No parameters on purpose, so this can be passed straight to queryFn.
    getAll: async (): Promise<T[]> => {
      const { data } = await apiClient.get<T[]>(path);
      return data;
    },

    create: async (payload: CreateDto): Promise<T> => {
      const { data } = await apiClient.post<T>(path, payload);
      return data;
    },

    update: async (id: string, payload: UpdateDto): Promise<T> => {
      const { data } = await apiClient.patch<T>(`${path}/${id}`, payload);
      return data;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`${path}/${id}`);
    },
  };
}
