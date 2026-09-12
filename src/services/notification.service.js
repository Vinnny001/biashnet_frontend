// src/services/notification.service.js

import { api } from "./api";

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
|
| Order-lifecycle notifications for whoever is signed in — the same feed
| serves buyers and sellers, since the backend scopes every row to the
| caller's own uid. A seller who also buys sees both, which is correct:
| they are one person with one notification list.
|
| Served by backend, which proxies to the payment service that writes
| them.
|
|--------------------------------------------------------------------------
*/

export const notificationService = {
  list(limit = 50) {
    return api.get("/notifications", { params: { limit } });
  },

  markRead(notificationId) {
    return api.patch(`/notifications/${notificationId}/read`);
  },

  markAllRead() {
    return api.post("/notifications/read-all");
  },
};
