import api from "./api";

export const userService = {
  list(params = {}) {
    return api.get("/users", { params });
  },

  get(id) {
    return api.get(`/users/${id}`);
  },

  create(payload) {
    return api.post("/users", payload);
  },

  update(id, payload) {
    return api.patch(`/users/${id}`, payload);
  },

  remove(id) {
    return api.delete(`/users/${id}`);
  },

  updateProfile(payload) {
    return api.patch("/users/me", payload);
  }
};
