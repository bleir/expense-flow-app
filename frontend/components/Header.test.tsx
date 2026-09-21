import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Header from "./Header";

vi.mock("./ThemeToggle", () => ({
  default: () => <button type="button" aria-label="Toggle theme" />,
}));

describe("Header", () => {
  it("renders the app name as a home link", () => {
    render(<Header />);

    const brand = screen.getByRole("link", { name: /expense\s*flow/i });

    expect(brand).toHaveAttribute("href", "/");
    expect(brand).toHaveTextContent("Expense");
    expect(brand).toHaveTextContent("Flow");
  });

  it("renders guest navigation and the theme toggle", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/sign-in",
    );
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/sign-up",
    );
    expect(screen.getByRole("button", { name: "Toggle theme" })).toBeInTheDocument();
  });
});
