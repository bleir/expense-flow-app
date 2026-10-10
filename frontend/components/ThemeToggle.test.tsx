import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/lib/auth";
import { AUTH_STORAGE_KEY } from "@/lib/authStorage";
import { ThemeProvider } from "@/lib/theme";
import ThemeToggle from "./ThemeToggle";

const { getMe, updateTheme } = vi.hoisted(() => ({
  getMe: vi.fn(),
  updateTheme: vi.fn(),
}));

vi.mock("@/lib/userApi", () => ({
  userApi: {
    getMe: (...args: unknown[]) => getMe(...args),
    updateTheme: (...args: unknown[]) => updateTheme(...args),
  },
}));

function renderToggle() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    getMe.mockReset();
    updateTheme.mockReset();
    getMe.mockResolvedValue({
      id: "1",
      email: "ada@example.com",
      theme: "light",
    });
    updateTheme.mockImplementation(async (theme: string) => ({
      id: "1",
      email: "ada@example.com",
      theme,
    }));
  });

  it("uses the account theme and saves changes to the account", async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        id: "1",
        email: "ada@example.com",
        accessToken: "token",
      }),
    );
    localStorage.setItem("theme", "dark");

    renderToggle();

    const toggle = await screen.findByRole("switch", { name: "Dark theme" });
    await waitFor(() => expect(toggle).toBeEnabled());

    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(localStorage.getItem("theme")).toBeNull();
    expect(document.documentElement).not.toHaveClass("dark");

    fireEvent.click(toggle);

    await waitFor(() => expect(updateTheme.mock.calls[0]?.[0]).toBe("dark"));
    expect(await screen.findByRole("switch", { name: "Dark theme" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBeNull();
  });
});
