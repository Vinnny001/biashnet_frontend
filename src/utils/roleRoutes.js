export const ROLE_HOME = {
  admin: "/admin/dashboard",
  seller: "/seller/dashboard",
  investor: "/investor/dashboard",
  buyer: "/buyer/home",
  employee: "/employee/dashboard"
};

export const ACCOUNT_TYPE_LABELS = {
  buyer: "Buyer",
  seller: "Seller",
  admin: "Admin",
  investor: "Investor",
  employee: "Work Account"
};

/*
 * Account types that can be switched into on an existing session.
 * Mirrors the backend's SWITCHABLE_ACCOUNT_TYPES in authService.js —
 * everything else needs a fresh sign-in because it's OTP-protected.
 * The backend enforces this regardless; this list only decides whether
 * the UI offers a direct switch or sends the user to sign in again.
 */
export const DIRECT_SWITCH_ACCOUNT_TYPES = ["buyer", "seller"];

export function requiresReLogin(accountType) {
  return !DIRECT_SWITCH_ACCOUNT_TYPES.includes(accountType);
}

/*
 * Each account type has its own notification screen, showing only the
 * notifications that concern that account. One person with several
 * accounts receives every push on their device, but tapping one opens
 * the screen of the account it belongs to.
 */
export const NOTIFICATIONS_PATH = {
  buyer: "/notifications",
  seller: "/seller/notifications",
  employee: "/employee/notifications",
  investor: "/investor/notifications",
  admin: "/admin/notifications"
};

/*
 * Notification audiences are the account types upper-cased — see the
 * payment service's utils/notificationAudience.js.
 */
export function audienceForAccountType(accountType) {
  return accountType ? String(accountType).toUpperCase() : null;
}

export function accountTypeForAudience(audience) {
  const accountType = String(audience || "").toLowerCase();
  return NOTIFICATIONS_PATH[accountType] ? accountType : null;
}

/*
 * What to do when a push notification is tapped. Pure, so the policy can
 * be tested without a device:
 *
 *   nobody signed in               -> "login"  (then its notifications)
 *   same account, or unknown one   -> "open"   that account's notifications
 *   buyer <-> seller               -> "switch" in place, then open
 *   work / investor / admin        -> "login"  to that account first
 *
 * `targetAccountType` is the account the notification belongs to.
 */
export function planPushNavigation({ targetAccountType, signedIn, currentAccountType }) {
  if (!signedIn) {
    return { action: "login", accountType: targetAccountType || null };
  }

  if (!targetAccountType || targetAccountType === currentAccountType) {
    return { action: "open", accountType: currentAccountType };
  }

  if (requiresReLogin(targetAccountType)) {
    return { action: "login", accountType: targetAccountType };
  }

  return { action: "switch", accountType: targetAccountType };
}
