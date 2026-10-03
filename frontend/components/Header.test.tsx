import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/lib/auth";
import Header from "./Header";

vi.mock("./ThemeToggle", () => ({
  default: () => <button type="button" aria-label="Toggle theme" />,
}));

function renderHeader() {
  return render(
    <AuthProvider>
      <Header />
    </AuthProvider>,
  );
}

describe("Header", () => {
  it("renders the app name as a home link", () => {
    renderHeader();

    const brand = screen.getByRole("link", { name: /expense\s*flow/i });

    expect(brand).toHaveAttribute("href", "/");
    expect(brand).toHaveTextContent("Expense");
    expect(brand).toHaveTextContent("Flow");
  });

  it("renders guest navigation without the theme toggle", () => {
    renderHeader();

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/sign-up",
    );
    expect(
      screen.queryByRole("button", { name: "Toggle theme" }),
    ).not.toBeInTheDocument();
  });
});
