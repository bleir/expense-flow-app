import { apiClient } from "@/lib/apiClient";

export type ThemePreference = "light" | "dark";

export interface UserProfile {
  id: string;
  email: string;
  theme: ThemePreference;
}

export const userApi = {
  getMe: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<UserProfile>("/users/me");
    return data;
  },

  updateTheme: async (theme: ThemePreference): Promise<UserProfile> => {
    const { data } = await apiClient.patch<UserProfile>("/users/me", { theme });
    return data;
  },
};
