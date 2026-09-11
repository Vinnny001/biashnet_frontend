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
