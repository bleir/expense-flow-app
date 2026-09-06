import TransactionsList from "../expenses/components/TransactionsList";
import SpendingLineChart from "./components/SpendingLineChart";

export default function DashboardPage() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <SpendingLineChart />
      <TransactionsList dashboardView={true} />
    </main>
  );
}
