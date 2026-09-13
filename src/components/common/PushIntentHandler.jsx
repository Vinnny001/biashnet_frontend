import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import {
  NOTIFICATIONS_PATH,
  planPushNavigation
} from "../../utils/roleRoutes";
import {
  PUSH_INTENT_EVENT,
  clearPushIntent,
  readPushIntent
} from "../../utils/pushIntent";

/*
|--------------------------------------------------------------------------
| Opens a tapped push notification in the account it belongs to
|--------------------------------------------------------------------------
|
| One person can have buyer, seller, work, investor and admin accounts on
| the same login, and gets every account's pushes. Tapping one:
|
|   same account as the one open  -> its notifications
|   buyer <-> seller              -> switch in place, then its notifications
|   work / investor / admin       -> sign in to that account; the login page
|                                    then sends them to its notifications
|   nobody signed in              -> sign in first
|
| Protected accounts need a fresh sign-in because they are OTP-gated — the
| same rule the account switcher follows.
|
| Renders nothing. Mounted once, inside the router and the auth provider.
|
|--------------------------------------------------------------------------
*/

export default function PushIntentHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, loading, switchAccount } = useAuth();

  const [tapCount, setTapCount] = useState(0);
  const switching = useRef(false);

  useEffect(() => {
    const onTap = () => setTapCount((count) => count + 1);
    window.addEventListener(PUSH_INTENT_EVENT, onTap);
    return () => window.removeEventListener(PUSH_INTENT_EVENT, onTap);
  }, []);

  useEffect(() => {
    if (loading || switching.current) return;

    const intent = readPushIntent();
    if (!intent) return;

    /*
     * The login page owns what happens after signing in (including the
     * work-account role picker), so never navigate out from under it.
     */
    if (location.pathname === "/login") return;

    const current = user?.role;

    const plan = planPushNavigation({
      targetAccountType: intent.accountType,
      signedIn: Boolean(user && token),
      currentAccountType: current
    });

    if (plan.action === "login") {
      // Intent stays stored; the login page consumes it after sign-in.
      navigate("/login", { state: { accountType: plan.accountType || undefined } });
      return;
    }

    if (plan.action === "open") {
      clearPushIntent();
      navigate(NOTIFICATIONS_PATH[plan.accountType] || NOTIFICATIONS_PATH.buyer);
      return;
    }

    const target = plan.accountType;

    switching.current = true;

    switchAccount(target)
      .then((nextUser) => {
        clearPushIntent();
        navigate(NOTIFICATIONS_PATH[nextUser?.role] || NOTIFICATIONS_PATH[target]);
      })
      .catch((error) => {
        // e.g. that account no longer exists — open what they do have.
        console.error("Could not switch account for notification:", error);
        clearPushIntent();
        navigate(NOTIFICATIONS_PATH[current] || "/");
      })
      .finally(() => {
        switching.current = false;
      });
  }, [tapCount, loading, user, token, location.pathname, navigate, switchAccount]);

  return null;
}
