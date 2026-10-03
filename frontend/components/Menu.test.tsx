import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AuthProvider } from "@/lib/auth";
import { mockUsePathname } from "../vitest.setup";
import Menu from "./Menu";

function renderMenu() {
  return render(
    <AuthProvider>
      <Menu />
    </AuthProvider>,
  );
}

describe("Menu", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("renders a sign-in button and a sign-up link for guests", () => {
    renderMenu();

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
  });

  it("opens the sign-in dialog without navigating", () => {
    renderMenu();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Use your email and password.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
  });

  it("renders signed-in destinations after a stored session", async () => {
    localStorage.setItem(
      "expense-flow-user",
      JSON.stringify({ id: "1", email: "ada@example.com" }),
    );

    renderMenu();

    expect(await screen.findByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: "Expenses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logout" })).toHaveAttribute(
      "data-variant",
      "outline",
    );
    expect(screen.queryByRole("button", { name: "Sign in" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sign up" })).not.toBeInTheDocument();
  });

  it("marks the current page in the navigation", async () => {
    localStorage.setItem(
      "expense-flow-user",
      JSON.stringify({ id: "1", email: "ada@example.com" }),
    );
    mockUsePathname.mockReturnValue("/expenses");

    renderMenu();

    expect(await screen.findByRole("link", { name: "Expenses" })).toHaveClass(
      "bg-accent",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveClass(
      "bg-accent",
    );
  });
});
