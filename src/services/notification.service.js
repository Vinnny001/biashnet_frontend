// src/services/notification.service.js

import { api } from "./api";

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
|
| Every notification is stored against the person's uid, and tagged with
| the account it concerns (BUYER, SELLER, EMPLOYEE, INVESTOR, ADMIN). Each
| account's screen passes its own audience so it shows only its own —
| the seller screen doesn't list the same person's buyer updates.
|
| Served by backend, which proxies to the payment service that writes
| them.
|
|--------------------------------------------------------------------------
*/

export const notificationService = {
  list({ limit = 50, audience } = {}) {
    return api.get("/notifications", { params: { limit, audience } });
  },

  markRead(notificationId) {
    return api.patch(`/notifications/${notificationId}/read`);
  },

  markAllRead(audience) {
    // An empty object, not null: axios sends null as the JSON text "null",
    // which the backend's JSON body parser rejects before the route runs.
    return api.post("/notifications/read-all", {}, { params: { audience } });
  },
};
