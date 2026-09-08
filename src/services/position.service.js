// src/services/position.service.js

import { paymentApi } from "./api";

export const positionService = {
  list() {
    return paymentApi.get("/positions");
  },

  create(payload) {
    return paymentApi.post("/positions", payload);
  },

  update(positionId, payload) {
    return paymentApi.patch(`/positions/${positionId}`, payload);
  },
};
