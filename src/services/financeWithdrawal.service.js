// src/services/financeWithdrawal.service.js

import { paymentApi } from "./api";

export const financeWithdrawalService = {
  list() {
    return paymentApi.get("/finance-withdrawals");
  },

  get(withdrawalId) {
    return paymentApi.get(`/finance-withdrawals/${withdrawalId}`);
  },

  create(payload) {
    return paymentApi.post("/finance-withdrawals", payload);
  },
};
