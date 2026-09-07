import { paymentApi } from "./api";

/*
|--------------------------------------------------------------------------
| CREATE CHECKOUT
|--------------------------------------------------------------------------
|
| Creates the marketplace order.
|
| Backend is authoritative for:
| - product
| - seller
| - price
| - stock
| - commission
| - totals
| - buyerId
|
*/

export async function createCheckout({
  items,
  buyerPhone,
  deliveryAddress,
  idempotencyKey,
}) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  if (!buyerPhone) {
    throw new Error("M-PESA phone number is required.");
  }

  const response = await paymentApi.post(
    "/payments/checkout",
    {
      items,
      buyerPhone,
      deliveryAddress,
      idempotencyKey,
    }
  );

  return response;
}


/*
|--------------------------------------------------------------------------
| GET CHECKOUT
|--------------------------------------------------------------------------
*/

export async function getCheckout(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  return paymentApi.get(
    `/payments/checkout/${orderId}`
  );
}


/*
|--------------------------------------------------------------------------
| INITIATE M-PESA
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| We DO NOT send amount.
|
| Backend reads:
|
| marketplaceOrders/{orderId}.buyerTotal
|
*/

export async function initiatePayment({
  orderId,
  phoneNumber,
}) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  if (!phoneNumber) {
    throw new Error("M-PESA phone number is required.");
  }

  return paymentApi.post(
    "/payments/initiate",
    {
      orderId,
      phoneNumber,
      paymentMethod: "MPESA",
    }
  );
}


/*
|--------------------------------------------------------------------------
| BUY NOW
|--------------------------------------------------------------------------
|
| COMPLETE FLOW:
|
| 1. Create order
| 2. Initiate STK Push
| 3. Return both results
|
*/

export async function buyNow({
  listingId,
  quantity = 1,
  buyerPhone,
  deliveryAddress,
}) {
  if (!listingId) {
    throw new Error("Product ID is required.");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Invalid quantity.");
  }

  if (!buyerPhone) {
    throw new Error("M-PESA phone number is required.");
  }

  /*
  --------------------------------------------------------
  IDEMPOTENCY KEY
  --------------------------------------------------------
  */

  const idempotencyKey =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `buy-now-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 12)}`;


  /*
  --------------------------------------------------------
  STEP 1 — CREATE ORDER
  --------------------------------------------------------
  */

  const checkout =
    await createCheckout({
      items: [
        {
          listingId,
          quantity,
        },
      ],

      buyerPhone,

      deliveryAddress,

      idempotencyKey,
    });


  if (!checkout?.orderId) {
    throw new Error(
      checkout?.message ||
      "Checkout was created but no order ID was returned."
    );
  }


  /*
  --------------------------------------------------------
  STEP 2 — SEND STK PUSH
  --------------------------------------------------------
  */

  const payment =
    await initiatePayment({
      orderId:
        checkout.orderId,

      phoneNumber:
        buyerPhone,
    });


  /*
  --------------------------------------------------------
  RETURN COMPLETE RESULT
  --------------------------------------------------------
  */

  return {
    checkout,
    payment,

    orderId:
      checkout.orderId,

    paymentId:
      payment?.paymentId || null,

    amount:
      checkout.buyerTotal,

    status:
      payment?.status || "PENDING",

    checkoutRequestID:
      payment?.checkoutRequestID || null,

    merchantRequestID:
      payment?.merchantRequestID || null,
  };
}


/*
|--------------------------------------------------------------------------
| CART CHECKOUT
|--------------------------------------------------------------------------
*/

export async function checkoutCart({
  items,
  buyerPhone,
  deliveryAddress,
}) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  if (!buyerPhone) {
    throw new Error("M-PESA phone number is required.");
  }

  const idempotencyKey =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `cart-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 12)}`;


  /*
  --------------------------------------------------------
  CREATE ORDER
  --------------------------------------------------------
  */

  const checkout =
    await createCheckout({
      items,
      buyerPhone,
      deliveryAddress,
      idempotencyKey,
    });


  if (!checkout?.orderId) {
    throw new Error(
      checkout?.message ||
      "Unable to create checkout."
    );
  }


  /*
  --------------------------------------------------------
  SEND STK
  --------------------------------------------------------
  */

  const payment =
    await initiatePayment({
      orderId:
        checkout.orderId,

      phoneNumber:
        buyerPhone,
    });


  return {
    checkout,
    payment,

    orderId:
      checkout.orderId,

    paymentId:
      payment?.paymentId || null,

    amount:
      checkout.buyerTotal,

    status:
      payment?.status || "PENDING",

    checkoutRequestID:
      payment?.checkoutRequestID || null,

    merchantRequestID:
      payment?.merchantRequestID || null,
  };
}


export default {
  createCheckout,
  getCheckout,
  initiatePayment,
  buyNow,
  checkoutCart,
};