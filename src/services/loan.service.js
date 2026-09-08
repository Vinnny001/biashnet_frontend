// src/services/loan.service.js

import { paymentApi } from "./api";

export const loanService = {
  listLenders() {
    return paymentApi.get("/lenders");
  },

  createLender(payload) {
    return paymentApi.post("/lenders", payload);
  },

  listLoans() {
    return paymentApi.get("/loans");
  },

  createLoan(payload) {
    return paymentApi.post("/loans", payload);
  },

  repayLoan(loanId, amount) {
    return paymentApi.post(`/loans/${loanId}/repayments`, { amount });
  },
};
