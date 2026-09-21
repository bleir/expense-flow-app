import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockUsePathname } from "../vitest.setup";
import Menu from "./Menu";

const activeClass = "bg-sky-200";
const inactiveClass = "bg-transparent";

describe("Menu", () => {
  it("renders guest links and not the signed-in destinations", () => {
    render(<Menu />);

    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/sign-in",
    );
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/sign-up",
    );
    expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Expenses" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Categories" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Settings" })).not.toBeInTheDocument();
  });

  it("marks Sign in as active on /sign-in and nested routes", () => {
    mockUsePathname.mockReturnValue("/sign-in");
    const { rerender } = render(<Menu />);

    expect(screen.getByRole("link", { name: "Sign in" })).toHaveClass(activeClass);
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveClass(inactiveClass);

    mockUsePathname.mockReturnValue("/sign-in/reset");
    rerender(<Menu />);

    expect(screen.getByRole("link", { name: "Sign in" })).toHaveClass(activeClass);
  });

  it("marks Sign up as active on /sign-up", () => {
    mockUsePathname.mockReturnValue("/sign-up");
    render(<Menu />);

    expect(screen.getByRole("link", { name: "Sign up" })).toHaveClass(activeClass);
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveClass(inactiveClass);
  });

  it("marks no guest link as active on other routes", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<Menu />);

    expect(screen.getByRole("link", { name: "Sign in" })).toHaveClass(inactiveClass);
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveClass(inactiveClass);
  });
});
