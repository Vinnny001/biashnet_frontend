export function formatCurrency(value, currency = "KES") {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(number);
}

export function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function truncate(text = "", length = 120) {
  return text.length > length ? `${text.slice(0, length).trim()}...` : text;
}
