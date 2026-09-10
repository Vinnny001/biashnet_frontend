// src/services/push.js

import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { api } from "./api";

/*
|--------------------------------------------------------------------------
| Android Push Notifications (Capacitor + Firebase Cloud Messaging)
|--------------------------------------------------------------------------
|
| No-ops entirely on web (Capacitor.isNativePlatform() is false there) —
| this must never run/error in a browser tab. On Android, registers for
| push, gets an FCM token, and syncs it to the backend so mpesa-api can
| send real device pushes alongside its in-app notifications.
|
|--------------------------------------------------------------------------
*/

let registered = false;

export async function registerPushNotifications() {
  if (!Capacitor.isNativePlatform()) return;
  if (registered) return;
  registered = true;

  try {
    let permission = await PushNotifications.checkPermissions();

    if (permission.receive === "prompt") {
      permission = await PushNotifications.requestPermissions();
    }

    if (permission.receive !== "granted") {
      registered = false;
      return;
    }

    await PushNotifications.register();
  } catch (err) {
    console.error("Push notification setup failed:", err);
    registered = false;
  }
}

/*
|--------------------------------------------------------------------------
| Listeners — call once at app startup, independent of login state, so
| the "registration" event (which can fire before login finishes) is
| never missed. The token is only sent to the backend once there's an
| authenticated session to attach it to.
|--------------------------------------------------------------------------
*/

let listenersAttached = false;
let pendingToken = null;

export function attachPushListeners({ isAuthenticated }) {
  if (!Capacitor.isNativePlatform()) return;
  if (listenersAttached) return;
  listenersAttached = true;

  PushNotifications.addListener("registration", (token) => {
    if (isAuthenticated()) {
      syncDeviceToken(token.value);
    } else {
      pendingToken = token.value;
    }
  });

  PushNotifications.addListener("registrationError", (err) => {
    console.error("Push registration error:", err);
  });

  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    // App is in the foreground — the OS won't show a banner on its own.
    // Nothing to do here beyond logging for now; in-app notifications
    // already live in Firestore and are visible in the app itself.
    console.log("Push received (foreground):", notification);
  });

  PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
    console.log("Push tapped:", action.notification);
  });
}

/*
|--------------------------------------------------------------------------
| Call once login completes, in case "registration" fired first.
|--------------------------------------------------------------------------
*/

export function flushPendingDeviceToken() {
  if (pendingToken) {
    syncDeviceToken(pendingToken);
    pendingToken = null;
  }
}

async function syncDeviceToken(token) {
  try {
    await api.post("/users/me/device-token", { token, platform: "android" });
  } catch (err) {
    // Best-effort — a failed token sync shouldn't break the app.
    console.error("Failed to sync device token:", err);
  }
}
