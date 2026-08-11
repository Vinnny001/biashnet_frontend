import api from "./api";

export const cartService = {
  list() {
    return api.get("/cart");
  },
  listPending() {
    return api.get("/cart/pending");
  },
  addItem(productId, quantity = 1) {
    return api.post("/cart/items", { productId, quantity });
  },
  updateQuantity(itemId, quantity) {
    return api.patch(`/cart/items/${itemId}`, { quantity });
  },
  removeItem(itemId) {
    return api.delete(`/cart/items/${itemId}`);
  },
  initiateCheckout(itemId, { orderId, paymentId }) {
    return api.post(`/cart/items/${itemId}/checkout`, { orderId, paymentId });
  },
  merge(localItems) {
    return api.post("/cart/merge", { items: localItems });
  }
};