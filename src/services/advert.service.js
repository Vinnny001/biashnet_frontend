import api from "./api";

export const advertService = {
  list(params = {}) {
    return api.get("/adverts", { params });
  },

  get(id) {
    return api.get(`/adverts/${id}`);
  },

  create(payload) {
    return api.post("/adverts", payload);
  },

  update(id, payload) {
    return api.patch(`/adverts/${id}`, payload);
  },

  remove(id) {
    return api.delete(`/adverts/${id}`);
  }
};
