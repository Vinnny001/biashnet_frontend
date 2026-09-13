// src/services/product.service.js

import api, { uploadApi } from "./api";

export const productService = {
  /*
  |--------------------------------------------------------------------------
  | LIST PRODUCTS — main API
  |--------------------------------------------------------------------------
  */

  list(params = {}) {
    return api.get("/products", { params });
  },

  /*
  |--------------------------------------------------------------------------
  | GET PRODUCT — main API
  |--------------------------------------------------------------------------
  */

  get(id) {
    return api.get(`/products/${id}`);
  },

  /*
  |--------------------------------------------------------------------------
  | CREATE PRODUCT — upload server
  |--------------------------------------------------------------------------
  */

  create(payload) {
    return uploadApi.post("/upload/product", payload);
  },

  /*
  |--------------------------------------------------------------------------
  | UPDATE PRODUCT — upload server
  |--------------------------------------------------------------------------
  */

  update(id, payload) {
    return uploadApi.patch(`/upload/product/${id}`, payload);
  },

  /*
  |--------------------------------------------------------------------------
  | DELETE PRODUCT — upload server
  |--------------------------------------------------------------------------
  */

  remove(id) {
    return uploadApi.delete(`/upload/product/${id}`);
  },

  /*
  |--------------------------------------------------------------------------
  | MODERATE (approve / reject) — main API, admin-only
  |--------------------------------------------------------------------------
  | The note goes to the seller: required to reject, optional to approve.
  */

  updateStatus(id, status, note = "") {
    return api.patch(`/products/${id}/status`, { status, note });
  },

  /*
  |--------------------------------------------------------------------------
  | REVIEWS — main API
  |--------------------------------------------------------------------------
  */

  reviews(id) {
    return api.get(`/products/${id}/reviews`);
  },

  /*
  |--------------------------------------------------------------------------
  | TRACK VIEW — main API
  |--------------------------------------------------------------------------
  */

  trackView(id) {
    return api.post(`/products/${id}/view`);
  },
};