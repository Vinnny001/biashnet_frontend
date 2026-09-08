// src/services/investorLedger.service.js

import { api } from "./api";

export const investorLedgerService = {
  ledger(investorId) {
    return api.get(`/investors/${investorId}/ledger`);
  },

  payout(investorId, amount) {
    return api.post(`/investors/${investorId}/payouts`, { amount });
  },
};
