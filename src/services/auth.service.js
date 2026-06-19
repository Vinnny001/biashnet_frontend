import api from "./api";

export const authService = {
  login(credentials) {
    return api.post("/auth/login", credentials);
  },

  signup(payload) {
    return api.post("/auth/signup", payload);
  },

  logout() {
    return api.post("/auth/logout");
  },

  me() {
    return api.get("/auth/me");
  },

  forgotPassword(email) {
    return api.post("/auth/forgot-password", { email });
  },

  resetPassword(payload) {
    return api.post("/auth/reset-password", payload);
  }
};
