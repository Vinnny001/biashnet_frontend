// src/services/loan.service.js

import { api } from "./api";

export const loanService = {
  listLenders() {
    return api.get("/lenders");
  },

  createLender(payload) {
    return api.post("/lenders", payload);
  },

  listLoans() {
    return api.get("/loans");
  },

  createLoan(payload) {
    return api.post("/loans", payload);
  },

  repayLoan(loanId, amount) {
    return api.post(`/loans/${loanId}/repayments`, { amount });
  },
};
