// src/services/seller.service.js

import { paymentApi } from "./api";

/*
|--------------------------------------------------------------------------
| Seller
|--------------------------------------------------------------------------
|
| These live on the payment service (mpesa-api), which owns marketplace
| orders, seller wallets and settlement — not the main backend.
|
|--------------------------------------------------------------------------
*/

export const sellerService = {
  /*
   * Shop details, product/order statistics, recent products and orders.
   */
  dashboard() {
    return paymentApi.get("/seller/dashboard");
  },

  summary() {
    return paymentApi.get("/seller/summary");
  },

  /*
   * The seller's own wallet: availableBalance is withdrawable now,
   * pendingBalance is still held in escrow until the buyer's completion
   * code is verified.
   */
  wallet() {
    return paymentApi.get("/seller/wallet");
  },

  orders() {
    return paymentApi.get("/seller/orders");
  },
};
