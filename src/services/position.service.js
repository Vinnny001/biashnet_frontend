// src/services/position.service.js

import { api } from "./api";

export const positionService = {
  list() {
    return api.get("/positions");
  },

  create(payload) {
    return api.post("/positions", payload);
  },

  update(positionId, payload) {
    return api.patch(`/positions/${positionId}`, payload);
  },
};
