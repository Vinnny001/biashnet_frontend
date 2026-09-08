// src/services/financeWithdrawal.service.js

import { api } from "./api";

export const financeWithdrawalService = {
  list() {
    return api.get("/finance-withdrawals");
  },

  get(withdrawalId) {
    return api.get(`/finance-withdrawals/${withdrawalId}`);
  },

  create(payload) {
    return api.post("/finance-withdrawals", payload);
  },
};
