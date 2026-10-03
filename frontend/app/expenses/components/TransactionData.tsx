interface transactionDateProps {
  label: string;
  data: string | React.ReactNode;
}

export default function TransactionData({ label, data }: transactionDateProps) {
  return (
    <div className="min-w-0 mt-4 px-2">
      <p className="text-muted-foreground pb-1 text-sm">{label}</p>
      <p className="text-base">{data}</p>
    </div>
  );
}
