import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

export const mockUsePathname = vi.fn(() => "/");

afterEach(() => {
  cleanup();
  mockUsePathname.mockReturnValue("/");
});

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));
