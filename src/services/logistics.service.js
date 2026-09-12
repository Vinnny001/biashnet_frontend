// src/services/logistics.service.js

import { api } from "./api";

export const logisticsService = {
  listPendingDropoffs() {
    return api.get("/logistics/pending-dropoffs");
  },

  confirmDropoff(subOrderId) {
    return api.post(`/logistics/sub-orders/${subOrderId}/confirm-dropoff`);
  },

  /*
   * Orders where every seller has dropped off, waiting to be sent out.
   */
  listReadyForDelivery() {
    return api.get("/logistics/ready-for-delivery");
  },

  markOutForDelivery(orderId) {
    return api.post(`/logistics/orders/${orderId}/out-for-delivery`);
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
