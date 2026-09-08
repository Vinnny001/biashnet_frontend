// src/services/companyInfo.service.js

import { paymentApi } from "./api";

export const companyInfoService = {
  get() {
    return paymentApi.get("/company-info");
  },

  update(payload) {
    return paymentApi.patch("/company-info", payload);
  },
};
