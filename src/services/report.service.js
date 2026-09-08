// src/services/report.service.js

import { api } from "./api";

export const reportService = {
  create(payload) {
    return api.post("/reports", payload);
  },

  listMine() {
    return api.get("/reports/mine");
  },

  listAll(params = {}) {
    return api.get("/reports", { params });
  },

  review(reportId, payload) {
    return api.patch(`/reports/${reportId}/review`, payload);
  },
};
