interface TransactionDataProps {
  label: string;
  data: React.ReactNode;
}

export default function TransactionData({ label, data }: TransactionDataProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-medium">{data}</div>
    </div>
  );
}
