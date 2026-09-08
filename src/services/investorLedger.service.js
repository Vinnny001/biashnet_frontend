// src/services/investorLedger.service.js

import { paymentApi } from "./api";

export const investorLedgerService = {
  ledger(investorId) {
    return paymentApi.get(`/investors/${investorId}/ledger`);
  },

  payout(investorId, amount) {
    return paymentApi.post(`/investors/${investorId}/payouts`, { amount });
  },
};
