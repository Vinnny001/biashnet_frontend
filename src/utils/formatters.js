export function formatCurrency(value, currency = "KES") {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(number);
}

/*
 * mpesa-api returns raw Firestore data — its timestamp fields arrive as
 * serialized { _seconds, _nanoseconds } objects (Firestore Admin SDK
 * Timestamps lose their .toDate() method once JSON-serialized), not
 * strings/numbers/Dates. backend, by contrast, converts these to ISO
 * strings before sending them. This must handle both without ever
 * throwing — Intl.DateTimeFormat throws on an invalid Date instead of
 * returning "Invalid Date", and an uncaught throw here blanks the
 * entire page since nothing render-time catches it.
 */
export function toDate(value) {
  if (!value) return null;

  let date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value?._seconds === "number") {
    date = new Date(value._seconds * 1000 + Math.round((value._nanoseconds || 0) / 1e6));
  } else if (typeof value?.seconds === "number") {
    date = new Date(value.seconds * 1000 + Math.round((value.nanoseconds || 0) / 1e6));
  } else {
    date = new Date(value);
  }

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = toDate(value);

  if (!date) return "Not available";

  try {
    return new Intl.DateTimeFormat("en-KE", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  } catch {
    return "Not available";
  }
}

export function truncate(text = "", length = 120) {
  return text.length > length ? `${text.slice(0, length).trim()}...` : text;
}
