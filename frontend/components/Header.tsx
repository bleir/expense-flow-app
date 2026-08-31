import Link from "next/link";
import Menu from "@/components/Menu";

export default function Header() {
  return (
    <header className="flex flex-row items-center justify-between p-4">
      <Link href="/">
        <span className="text-lg">Expense</span>
        <span className="text-sky-900 font-bold text-lg">Flow</span>
      </Link>
      <Menu />
    </header>
  );
}
