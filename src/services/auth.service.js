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

  /*
   * Switch the active account on the current session. The backend only
   * allows buyer <-> seller here; admin/investor/work accounts require a
   * fresh sign-in so the OTP step can't be skipped.
   */
  switchAccount(accountType) {
    return api.post("/auth/switch-account", { accountType });
  },

  forgotPassword(email) {
    return api.post("/auth/forgot-password", { email });
  },

  resetPassword(payload) {
    return api.post("/auth/reset-password", payload);
  }
};
