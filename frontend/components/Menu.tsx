"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";

const navItemsLoggedInUser = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Expenses", href: "/expenses" },
  { label: "Categories", href: "/categories" },
  { label: "Settings", href: "/settings" },
];

const navItemsLogoutUser = [
  { label: "Sign in", href: "/sign-in" },
  { label: "Sign up", href: "/sign-up" },
];

export default function Menu() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItemsLogoutUser.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`) ||
            (item.href === "/dashboard" && pathname === "/");

          return (
            <NavigationMenuItem key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium outline-none transition-colors",
                  isActive
                    ? "bg-sky-200 text-sky-900 hover:bg-sky-200 hover:text-sky-900 focus:bg-sky-200 focus:text-sky-900 focus-visible:bg-sky-200 focus-visible:text-sky-900 dark:bg-sky-800 dark:text-sky-100 dark:hover:bg-sky-800 dark:hover:text-sky-100 dark:focus:bg-sky-800 dark:focus:text-sky-100 dark:focus-visible:bg-sky-800 dark:focus-visible:text-sky-100"
                    : "bg-transparent hover:bg-sky-200 hover:text-sky-900 dark:hover:bg-sky-800 dark:hover:text-sky-100",
                )}
              >
                {item.label}
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
