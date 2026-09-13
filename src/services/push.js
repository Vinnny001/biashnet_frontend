// src/services/push.js

import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { api } from "./api";
import { PUSH_INTENT_EVENT, savePushIntent } from "../utils/pushIntent";

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

/*
 * Must match the channelId the backend sends in every FCM message's
 * android.notification.channelId (see pushService.js) — Android routes
 * an incoming push through whichever channel ID is on the payload, and
 * a channel that doesn't exist yet on the device falls back to its
 * default (IMPORTANCE_DEFAULT), which never shows a heads-up banner.
 */
export const NOTIFICATION_CHANNEL_ID = "biashnet_default";

let registered = false;

export async function registerPushNotifications() {
  if (!Capacitor.isNativePlatform()) return;
  if (registered) return;
  registered = true;

  try {
    /*
     * IMPORTANCE_HIGH (4) — anything lower (the Android default is
     * IMPORTANCE_DEFAULT = 3) delivers the notification silently into
     * the shade instead of popping up as a heads-up banner. Must be
     * created before the first notification arrives; changing an
     * existing channel's importance later has no effect (Android only
     * honors it at creation), so if a lower-importance channel with
     * this same ID was ever created on a device before this shipped,
     * that device needs the app reinstalled or the channel deleted by
     * hand in system settings to pick up the new importance.
     */
    await PushNotifications.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: "Biashnet Notifications",
      description: "Order, payment, and delivery updates",
      importance: 4,
      visibility: 1,
      sound: "default",
      vibration: true,
    });

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

/*
 * The device's FCM token, and which user it is currently registered to.
 * A device belongs to exactly one signed-in user: registering it for a
 * new user moves it (the backend detaches it from anyone else), and
 * signing out releases it — so a phone never shows another account's
 * notifications, and shows none at all when nobody is signed in.
 */
let currentToken = null;
let claimedForUid = null;
let getSessionUid = () => null;

export function attachPushListeners({ getUserId }) {
  if (!Capacitor.isNativePlatform()) return;
  if (listenersAttached) return;
  listenersAttached = true;

  getSessionUid = getUserId || (() => null);

  PushNotifications.addListener("registration", (token) => {
    currentToken = token.value;

    // The token can arrive before or after sign-in finishes.
    const uid = getSessionUid();
    if (uid) claimDeviceForUser(uid);
  });

  PushNotifications.addListener("registrationError", (err) => {
    console.error("Push registration error:", err);
  });

  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    // App is in the foreground. Android hands the message to the app
    // instead of showing it, so on its own this would be silent. The
    // banner comes from presentationOptions ("alert") in
    // capacitor.config.json: the plugin then posts a native notification
    // on the message's channelId (biashnet_default, IMPORTANCE_HIGH).
    // That config is baked in at build time — `npx cap sync` and rebuild
    // the APK after changing it.
    console.log("Push received (foreground):", notification);
  });

  /*
   * The user tapped a notification (from the tray, the lock screen, or a
   * foreground banner). The server puts `audience` in the push data —
   * which of this person's accounts it concerns. Store it and let
   * PushIntentHandler open that account's notifications, switching or
   * signing in first as needed. Stored rather than handled here because
   * a tap can cold-start the app before auth or the router exist.
   */
  PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
    const data = action?.notification?.data || {};

    savePushIntent({
      audience: data.audience || null,
      notificationId: data.notificationId || null,
      orderId: data.orderId || null
    });

    window.dispatchEvent(new Event(PUSH_INTENT_EVENT));
  });
}

/*
|--------------------------------------------------------------------------
| Device ownership
|--------------------------------------------------------------------------
*/

/*
 * Register this device for the signed-in user. Called whenever the
 * session's user changes. Switching between accounts of the SAME person
 * (buyer <-> seller, work) keeps the same uid and is a no-op.
 */
export async function claimDeviceForUser(uid) {
  if (!Capacitor.isNativePlatform()) return;
  if (!uid || !currentToken) return; // registration will claim when the token arrives
  if (claimedForUid === uid) return;

  try {
    await api.post("/users/me/device-token", { token: currentToken, platform: "android" });
    claimedForUid = uid;
  } catch (err) {
    // Best-effort — a failed token sync shouldn't break the app.
    console.error("Failed to register device for notifications:", err);
  }
}

/*
 * Detach this device from the current user. Must run BEFORE the session
 * is cleared — the request needs that user's auth token. If it never
 * reaches the server (offline), the next sign-in on this device still
 * detaches it from the old user server-side.
 */
export async function releaseDevice() {
  if (!Capacitor.isNativePlatform()) return;

  const token = currentToken;
  claimedForUid = null;

  if (!token) return;

  try {
    await api.delete("/users/me/device-token", { data: { token } });
  } catch (err) {
    console.error("Failed to unregister device on sign-out:", err);
  }
}
