import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Expenses", href: "/expenses" },
  { label: "Categories", href: "/categories" },
  { label: "Settings", href: "/settings" },
];

export default function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link
              href={item.href}
              className={cn(
                navigationMenuTriggerStyle(),
                "hover:bg-sky-100 hover:text-sky-900 focus:bg-sky-100 focus:text-sky-900",
              )}
            >
              {item.label}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
