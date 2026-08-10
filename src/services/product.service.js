import api from "./api";

export const productService = {
  list(params = {}) {
    return api.get("/products", { params });
  },

  get(id) {
    return api.get(`/products/${id}`);
  },

  create(payload) {
    return api.post("/image", payload);
  },

  update(id, payload) {
    return api.patch(`/products/${id}`, payload);
  },

  remove(id) {
    return api.delete(`/products/${id}`);
  },

  reviews(id) {
    return api.get(`/products/${id}/reviews`);
  },

  trackView(id) {          // <-- add if missing
    return api.post(`/products/${id}/view`);
  },
};
