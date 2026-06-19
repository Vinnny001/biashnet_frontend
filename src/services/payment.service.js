import api from "./api";

export const paymentService = {
  checkout(payload) {
    return api.post("/payments/checkout", payload);
  },

  status(id) {
    return api.get(`/payments/${id}`);
  }
};
