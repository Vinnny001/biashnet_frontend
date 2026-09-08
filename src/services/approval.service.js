// src/services/approval.service.js

import { api } from "./api";

export const approvalService = {
  list(requiredLevel) {
    return api.get("/approvals", {
      params: requiredLevel ? { requiredLevel } : {},
    });
  },

  approve(requestId) {
    return api.post(`/approvals/${requestId}/approve`);
  },

  reject(requestId, reason) {
    return api.post(`/approvals/${requestId}/reject`, { reason });
  },
};
