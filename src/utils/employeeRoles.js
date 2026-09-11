/*
 * Display names for the boolean role flags on employees/{uid}.roles.
 * "accountant" is what the business calls the Finance Lead.
 * Kept out of the page files so layouts can use it without pulling a
 * lazy-loaded page's chunk into the layout bundle.
 */
export const ROLE_LABELS = {
  ceo: "CEO",
  hr: "HR",
  accountant: "Finance Lead",
  techlead: "Tech Lead",
  marketing: "Marketing",
  admin: "Admin",
  logistics: "Logistics & Supply Chain",
};

export function roleLabel(role) {
  return ROLE_LABELS[role] || role || "Employee";
}
