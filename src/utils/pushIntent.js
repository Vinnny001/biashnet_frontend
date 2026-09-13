import { STORAGE_KEYS } from "./constants";
import { storage } from "./storage";
import { accountTypeForAudience } from "./roleRoutes";

/*
|--------------------------------------------------------------------------
| Push intent — "the user tapped a notification; take them to it"
|--------------------------------------------------------------------------
|
| Tapping a push can launch the app from nothing, or require signing in to
| a different account first, so the destination is kept in storage rather
| than in memory or router state (both of which a cold start or the login
| screen would lose).
|
| An intent expires so an old tap can't hijack a much later sign-in.
|
|--------------------------------------------------------------------------
*/

export const PUSH_INTENT_EVENT = "biashnet:push-intent";

const MAX_AGE_MS = 30 * 60 * 1000;

export function savePushIntent({ audience = null, notificationId = null, orderId = null } = {}) {
  try {
    storage.set(STORAGE_KEYS.PUSH_INTENT, {
      audience,
      notificationId,
      orderId,
      createdAt: Date.now()
    });
  } catch {
    // Storage can be unavailable; the tap simply opens the app as usual.
  }
}

export function readPushIntent() {
  const intent = storage.get(STORAGE_KEYS.PUSH_INTENT);

  if (!intent || typeof intent !== "object") return null;

  if (!intent.createdAt || Date.now() - intent.createdAt > MAX_AGE_MS) {
    clearPushIntent();
    return null;
  }

  return {
    ...intent,
    accountType: accountTypeForAudience(intent.audience)
  };
}

export function clearPushIntent() {
  try {
    storage.remove(STORAGE_KEYS.PUSH_INTENT);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}
