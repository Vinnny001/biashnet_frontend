// src/services/product.service.js

import api, { uploadApi } from "./api";

export const productService = {
  /*
  |--------------------------------------------------------------------------
  | LIST PRODUCTS
  |--------------------------------------------------------------------------
  */

  list(params = {}) {
    return api.get("/products", {
      params,
    });
  },

  /*
  |--------------------------------------------------------------------------
  | GET PRODUCT
  |--------------------------------------------------------------------------
  */

  get(id) {
    return api.get(`/products/${id}`);
  },

  /*
  |--------------------------------------------------------------------------
  | CREATE PRODUCT
  |--------------------------------------------------------------------------
  |
  | Product creation now happens on the upload server.
  |
  | Frontend
  |    ↓
  | upload server :5050
  |    ↓
  | verifySeller
  |    ↓
  | main API verifies JWT
  |    ↓
  | upload server receives verified seller
  |    ↓
  | Cloudinary / Firestore
  |
  */

  create(payload) {
    return uploadApi.post("/upload/product", payload);
  },

  /*
  |--------------------------------------------------------------------------
  | UPDATE PRODUCT
  |--------------------------------------------------------------------------
  |
  | Currently still handled by the main API.
  |
  */

  update(id, payload) {
    return api.patch(`/products/${id}`, payload);
  },

  /*
  |--------------------------------------------------------------------------
  | DELETE PRODUCT
  |--------------------------------------------------------------------------
  */

  remove(id) {
    return uploadApi.delete(`/product/${id}`);
  },

  /*
  |--------------------------------------------------------------------------
  | REVIEWS
  |--------------------------------------------------------------------------
  */

  reviews(id) {
    return api.get(`/products/${id}/reviews`);
  },

  /*
  |--------------------------------------------------------------------------
  | TRACK VIEW
  |--------------------------------------------------------------------------
  */

  trackView(id) {
    return api.post(`/products/${id}/view`);
  },
};