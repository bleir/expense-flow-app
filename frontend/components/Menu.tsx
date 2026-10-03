"use client";

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { useAuth } from "@/lib/auth";
import { Button } from "./ui/button";
import SignInDialog from "./SignInDialog";
import SignUpDialog from "./SignUpDialog";
import { cn } from "@/lib/utils";

const navItemsLoggedInUser = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Expenses", href: "/expenses" },
  { label: "Categories", href: "/categories" },
  { label: "Settings", href: "/settings" },
];

export default function Menu() {
  const pathname = usePathname();
  const { isLoggedIn, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    redirect("/");
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {isLoggedIn ? (
          <>
            {navItemsLoggedInUser.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`) ||
                (item.href === "/dashboard" && pathname === "/");

              return (
                <NavigationMenuItem key={item.href}>
                  <Button
                    variant="ghost"
                    asChild
                    className={cn(
                      isActive &&
                        "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </Button>
                </NavigationMenuItem>
              );
            })}
            <NavigationMenuItem>
              <Button variant="outline" className="ml-2" onClick={handleLogout}>
                Logout
              </Button>
            </NavigationMenuItem>
          </>
        ) : (
          <>
            <NavigationMenuItem>
              <SignInDialog />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <SignUpDialog />
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
