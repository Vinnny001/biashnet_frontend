// src/services/receipt.service.js

import { paymentApi } from "./api";

export const receiptService = {
  /*
  |--------------------------------------------------------------------------
  | LIST MY RECEIPTS (PAYMENT HISTORY)
  |--------------------------------------------------------------------------
  */

  list() {
    return paymentApi.get("/marketplace/receipts");
  },

  get(orderId) {
    return paymentApi.get(`/marketplace/receipts/${orderId}`);
  },

  /*
  |--------------------------------------------------------------------------
  | DOWNLOAD PDF
  |--------------------------------------------------------------------------
  |
  | Needs the auth header, so this can't be a plain <a href> link —
  | fetch as a blob (paymentApi's response interceptor is bypassed via
  | responseType so we get the raw PDF, not JSON-unwrapped data) and
  | trigger the browser's save dialog from an in-memory object URL.
  |
  */

  async downloadPdf(orderId) {
    const blob = await paymentApi.get(`/marketplace/receipts/${orderId}/pdf`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `biashnet-receipt-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
