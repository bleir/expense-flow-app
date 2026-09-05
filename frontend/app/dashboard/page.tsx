import TransactionsList from "../expenses/components/TransactionsList";

export default function DashboardPage() {
  return (
    <main className="p-6">
      <TransactionsList dashboardView={true} />
    </main>
  );
}
