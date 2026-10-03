"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { useAuth } from "@/lib/auth";
import { Button, buttonVariants } from "./ui/button";
import { VariantProps } from "class-variance-authority";
import SignInDialog from "./SignInDialog";
import { redirect } from "next/navigation";
import SignUpDialog from "./SignUpDialog";

type NavItem = {
  label: string;
  href: string;
  variant: NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
};

const navItemsLoggedInUser: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", variant: "ghost" },
  { label: "Expenses", href: "/expenses", variant: "ghost" },
  { label: "Categories", href: "/categories", variant: "ghost" },
  { label: "Settings", href: "/settings", variant: "ghost" },
];

export default function Menu() {
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
            {navItemsLoggedInUser.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Button variant={item.variant} asChild className="mx-1">
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <Button variant="destructive" onClick={handleLogout}>
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
