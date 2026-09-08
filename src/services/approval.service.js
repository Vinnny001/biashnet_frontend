// src/services/approval.service.js

import { paymentApi } from "./api";

export const approvalService = {
  list(requiredLevel) {
    return paymentApi.get("/approvals", {
      params: requiredLevel ? { requiredLevel } : {},
    });
  },

  approve(requestId) {
    return paymentApi.post(`/approvals/${requestId}/approve`);
  },

  reject(requestId, reason) {
    return paymentApi.post(`/approvals/${requestId}/reject`, { reason });
  },
};
