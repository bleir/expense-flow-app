import Link from "next/link";
import { Wallet } from "lucide-react";

import Menu from "@/components/Menu";

export default function Header() {
  return (
    <header className="flex flex-row items-center justify-between border-b bg-card px-4 py-3">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
          <Wallet className="size-5" />
        </div>
        <span className="text-lg">
          Expense<span className="font-bold text-sky-900">Flow</span>
        </span>
      </Link>
      <Menu />
    </header>
  );
}
