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

    /*
     * The notifications screen knows the new count the moment a row is
     * read, so it sends it along and the bell changes at once. Anything
     * else (an arriving push) just says "something changed" and we ask.
     */
    const onChanged = (event) => {
      const detail = event?.detail;

      if (detail?.audience === audience && typeof detail.unreadCount === "number") {
        setCount(detail.unreadCount);
        return;
      }

      refresh();
    };

    window.addEventListener(APP_EVENTS.NOTIFICATIONS_UPDATED, onChanged);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);

    const timer = setInterval(refresh, POLL_MS);

    return () => {
      window.removeEventListener(APP_EVENTS.NOTIFICATIONS_UPDATED, onChanged);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(timer);
    };
  }, [refresh, isAuthenticated, audience]);

  return { count, refresh };
}

/*
 * Tell every bell on screen that notifications changed — read on the
 * notifications screen, or a new one just pushed to the device.
 *
 * Pass { audience, unreadCount } when the caller already knows the new
 * count, and that bell updates immediately instead of asking the server.
 */
export function announceNotificationsChanged(detail = null) {
  window.dispatchEvent(
    new CustomEvent(APP_EVENTS.NOTIFICATIONS_UPDATED, { detail })
  );
}
