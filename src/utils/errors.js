export function getErrorMessage(error, fallback = "Something went wrong.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

const PRODUCT_GONE_PATTERN = /^Product (\S+) no longer exists\.$/;
const PRODUCTS_GONE_PATTERN = /^Products (.+) no longer exist\.$/;

function joinNames(names) {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/*
 * The backend only knows a product by ID once it's been deleted — it
 * has no name left to send back, and checks every cart item up front
 * (not one at a time), so several missing items are reported together.
 * The cart still has each one's name cached from when it was added,
 * so swap the raw ID list for names the buyer actually recognizes.
 */
export function describeCheckoutError(error, cartItems = [], fallback = "Could not create your checkout. Please try again.") {
  const message = getErrorMessage(error, fallback);

  const singleMatch = message.match(PRODUCT_GONE_PATTERN);
  const pluralMatch = message.match(PRODUCTS_GONE_PATTERN);
  if (!singleMatch && !pluralMatch) return message;

  const listingIds = singleMatch ? [singleMatch[1]] : pluralMatch[1].split(",").map((id) => id.trim());

  const names = listingIds
    .map((listingId) => {
      const item = cartItems.find((i) => (i.listingId || i.id) === listingId);
      return item?.name || item?.title || null;
    })
    .filter(Boolean);

  if (names.length === 0) {
    return listingIds.length === 1
      ? "One of the items in your cart is no longer available. Please remove it and try again."
      : "Some of the items in your cart are no longer available. Please remove them and try again.";
  }

  const quoted = names.map((name) => `"${name}"`);
  return names.length === 1
    ? `${quoted[0]} is no longer available. Please remove it from your cart and try again.`
    : `${joinNames(quoted)} are no longer available. Please remove them from your cart and try again.`;
}

export class AppError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
  }
}
