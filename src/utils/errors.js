export function getErrorMessage(error, fallback = "Something went wrong.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

const PRODUCT_GONE_PATTERN = /^Product (\S+) no longer exists\.$/;

/*
 * The backend only knows the product by ID once it's been deleted —
 * it has no name left to send back. The cart still does (cached from
 * when the item was added), so swap the raw ID for the product name
 * the buyer actually recognizes.
 */
export function describeCheckoutError(error, cartItems = [], fallback = "Could not create your checkout. Please try again.") {
  const message = getErrorMessage(error, fallback);
  const match = message.match(PRODUCT_GONE_PATTERN);
  if (!match) return message;

  const listingId = match[1];
  const item = cartItems.find((i) => (i.listingId || i.id) === listingId);
  const name = item?.name || item?.title;

  return name
    ? `"${name}" is no longer available. Please remove it from your cart and try again.`
    : "One of the items in your cart is no longer available. Please remove it and try again.";
}

export class AppError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
  }
}
