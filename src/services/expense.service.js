// src/services/expense.service.js

import { api } from "./api";

export const expenseService = {
  list(params = {}) {
    return api.get("/expenses", { params });
  },

  create(payload) {
    return api.post("/expenses", payload);
  },
};
