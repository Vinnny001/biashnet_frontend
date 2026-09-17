import { useCallback, useEffect, useState } from "react";

import { notificationService } from "../services/notification.service";
import { useAuth } from "./useAuth";
import { APP_EVENTS } from "../utils/constants";

/*
 * How many unread notifications this account has, for the bell in a
 * layout's header.
 *
 * `audience` is the account the bell belongs to (BUYER, SELLER, ...), so
 * the buyer's bell never counts the same person's seller updates.
 *
 * Kept fresh three ways, because a badge that lies is worse than none:
 * the notifications screen announces when things are read, an arriving
 * push announces itself, and a slow poll catches everything else (a
 * notification written while the app sits open on another screen).
 */

const POLL_MS = 60000;

export function useUnreadNotifications(audience) {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !audience) {
      setCount(0);
      return;
    }

    try {
      const response = await notificationService.list({ audience });

      const rows = Array.isArray(response?.notifications)
        ? response.notifications
        : [];

      setCount(
        typeof response?.unreadCount === "number"
          ? response.unreadCount
          : rows.filter((row) => row.read !== true).length
      );
    } catch {
      // Leave the last known count rather than flashing an empty bell.
    }
  }, [audience, isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener(APP_EVENTS.NOTIFICATIONS_UPDATED, refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);

    const timer = setInterval(refresh, POLL_MS);

    return () => {
      window.removeEventListener(APP_EVENTS.NOTIFICATIONS_UPDATED, refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(timer);
    };
  }, [refresh, isAuthenticated]);

  return { count, refresh };
}

/*
 * Tell every bell on screen that notifications changed — read on the
 * notifications screen, or a new one just pushed to the device.
 */
export function announceNotificationsChanged() {
  window.dispatchEvent(new Event(APP_EVENTS.NOTIFICATIONS_UPDATED));
}
