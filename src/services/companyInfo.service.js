// src/services/companyInfo.service.js

import { api } from "./api";

export const companyInfoService = {
  get() {
    return api.get("/company-info");
  },

  update(payload) {
    return api.patch("/company-info", payload);
  },
};
