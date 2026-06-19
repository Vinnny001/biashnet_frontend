import api from "./api";

export const orderService = {
  list(params = {}) {
    return api.get("/orders", { params });
  },

  get(id) {
    return api.get(`/orders/${id}`);
  },

  create(payload) {
    return api.post("/orders", payload);
  },

  update(id, payload) {
    return api.patch(`/orders/${id}`, payload);
  },

  cancel(id) {
    return api.post(`/orders/${id}/cancel`);
  }
};
