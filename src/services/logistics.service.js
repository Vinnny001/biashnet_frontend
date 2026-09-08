// src/services/logistics.service.js

import { api } from "./api";

export const logisticsService = {
  listPendingDropoffs() {
    return api.get("/logistics/pending-dropoffs");
  },

  confirmDropoff(subOrderId) {
    return api.post(`/logistics/sub-orders/${subOrderId}/confirm-dropoff`);
  },

  getSubOrder(subOrderId) {
    return api.get(`/logistics/sub-orders/${subOrderId}`);
  },

  getSubOrdersForOrder(orderId) {
    return api.get(`/logistics/orders/${orderId}/sub-orders`);
  },

  verifyCompletionCode(orderId, code) {
    return api.post(`/marketplace/order-completion/${orderId}/verify`, { code });
  },
};
