"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Expenses", href: "/expenses" },
  { label: "Categories", href: "/categories" },
  { label: "Settings", href: "/settings" },
];

export default function Menu() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item) => {
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
                    ? "bg-sky-200 text-sky-900 hover:bg-sky-200 hover:text-sky-900 focus:bg-sky-200 focus:text-sky-900 focus-visible:bg-sky-200 focus-visible:text-sky-900"
                    : "bg-transparent hover:bg-sky-200 hover:text-sky-900",
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
