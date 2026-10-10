"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/lib/auth";
import { useQueryKeys } from "@/lib/queryKeys";
import { userApi, type ThemePreference, type UserProfile } from "@/lib/userApi";

const LEGACY_THEME_STORAGE_KEY = "theme";

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function systemTheme(): ThemePreference {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: ThemePreference) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

type ThemeContextValue = {
  theme: ThemePreference | undefined;
  setTheme: (theme: ThemePreference) => Promise<UserProfile>;
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isReady: authReady } = useAuth();
  const queryKeys = useQueryKeys();
  const queryClient = useQueryClient();
  const [guestTheme, setGuestTheme] = useState<ThemePreference>();

  const profile = useQuery({
    queryKey: queryKeys.profile,
    queryFn: userApi.getMe,
    enabled: authReady && isLoggedIn,
  });

  const { mutateAsync } = useMutation({
    mutationFn: userApi.updateTheme,
    onMutate: async (theme) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.profile });
      const previous = queryClient.getQueryData<UserProfile>(queryKeys.profile);
      queryClient.setQueryData<UserProfile>(queryKeys.profile, (current) =>
        current ? { ...current, theme } : current,
      );
      applyTheme(theme);
      return { previous };
    },
    onError: (_error, _theme, context) => {
      if (!context?.previous) return;
      queryClient.setQueryData(queryKeys.profile, context.previous);
      applyTheme(context.previous.theme);
    },
    onSuccess: (next) => {
      queryClient.setQueryData(queryKeys.profile, next);
    },
  });

  const savedTheme = profile.data?.theme;

  useIsoLayoutEffect(() => {
    if (!authReady) return;

    if (!isLoggedIn) {
      const next = systemTheme();
      setGuestTheme(next);
      applyTheme(next);
      return;
    }

    if (savedTheme) applyTheme(savedTheme);
  }, [authReady, isLoggedIn, savedTheme]);

  useEffect(() => {
    if (!authReady || isLoggedIn) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = media.matches ? "dark" : "light";
      setGuestTheme(next);
      applyTheme(next);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [authReady, isLoggedIn]);

  useEffect(() => {
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
  }, []);

  const setTheme = useCallback(
    (theme: ThemePreference) => mutateAsync(theme),
    [mutateAsync],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: isLoggedIn ? savedTheme : guestTheme,
      setTheme,
      isReady: authReady && isLoggedIn && profile.isSuccess,
    }),
    [authReady, guestTheme, isLoggedIn, profile.isSuccess, savedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within ThemeProvider");

  return {
    theme: value.theme,
    resolvedTheme: value.theme,
    setTheme: value.setTheme,
    isReady: value.isReady,
  };
}
