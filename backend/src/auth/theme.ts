export const THEME_PREFERENCES = ['light', 'dark'] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];
