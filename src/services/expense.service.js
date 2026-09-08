// src/services/expense.service.js

import { paymentApi } from "./api";

export const expenseService = {
  list(params = {}) {
    return paymentApi.get("/expenses", { params });
  },

  create(payload) {
    return paymentApi.post("/expenses", payload);
  },
};
