// src/services/logistics.service.js

import { paymentApi } from "./api";

export const logisticsService = {
  listPendingDropoffs() {
    return paymentApi.get("/logistics/pending-dropoffs");
  },

  confirmDropoff(subOrderId) {
    return paymentApi.post(`/logistics/sub-orders/${subOrderId}/confirm-dropoff`);
  },

  getSubOrder(subOrderId) {
    return paymentApi.get(`/logistics/sub-orders/${subOrderId}`);
  },

  getSubOrdersForOrder(orderId) {
    return paymentApi.get(`/logistics/orders/${orderId}/sub-orders`);
  },

  verifyCompletionCode(orderId, code) {
    return paymentApi.post(`/marketplace/order-completion/${orderId}/verify`, { code });
  },
};
