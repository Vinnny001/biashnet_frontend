// src/services/wishlist.service.js
import api from "./api";

/*
 * Liked listings. Buyer-only on the server too, so a seller or admin
 * account gets 403 here rather than quietly liking things.
 */
export const wishlistService = {
  list() {
    return api.get("/wishlist");
  },

  ids() {
    return api.get("/wishlist/ids");
  },

  add(productId) {
    return api.post(`/wishlist/${productId}`);
  },

  remove(productId) {
    return api.delete(`/wishlist/${productId}`);
  },
};
