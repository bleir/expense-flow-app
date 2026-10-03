import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthProvider } from "@/lib/auth";
import Header from "./Header";

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
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.queryByRole("switch", { name: "Dark theme" })).not.toBeInTheDocument();
  });
});
