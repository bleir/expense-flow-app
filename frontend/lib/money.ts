function locale() {
  return typeof navigator === "undefined" ? "en" : navigator.language;
}

export function formatMoney(
  amount: number | string,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) {
    return "—";
  }

  const maximumFractionDigits = options?.maximumFractionDigits ?? 2;
  const minimumFractionDigits =
    options?.minimumFractionDigits ??
    (maximumFractionDigits === 0 ? 0 : 2);

  return value.toLocaleString(locale(), {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}
