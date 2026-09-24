const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function locale() {
  return typeof navigator === "undefined" ? "en" : navigator.language;
}

export function startOfLocalDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function parseLocalDate(date: Date | string) {
  if (typeof date === "string" && DATE_ONLY.test(date)) {
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return startOfLocalDay(parsed);
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toDateInputValue(date?: Date | string) {
  if (!date) {
    return formatDateKey(new Date());
  }

  const parsed = parseLocalDate(date);
  return parsed ? formatDateKey(parsed) : formatDateKey(new Date());
}

export function formatDisplayDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
) {
  const parsed = parseLocalDate(date);
  if (!parsed) {
    return "—";
  }

  return parsed.toLocaleDateString(locale(), options);
}

export function isInCurrentMonth(date: Date | string) {
  const parsed = parseLocalDate(date);
  if (!parsed) {
    return false;
  }

  const now = new Date();
  return (
    parsed.getFullYear() === now.getFullYear() &&
    parsed.getMonth() === now.getMonth()
  );
}
