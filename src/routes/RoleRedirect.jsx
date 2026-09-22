import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Products from "../pages/buyer/Products";
import Loading from "../components/common/Loading";

import { ROLE_HOME } from "../utils/roleRoutes";

/*
 * What "/" means depends on who is asking.
 *
 * A visitor gets the marketplace itself — the products page opens with
 * its own welcome, so there is nothing to sit in front of it.
 *
 * Someone signed in is sent to the home of the account they signed in as.
 * Without this a seller or an admin who typed the bare address landed in
 * the buyer's shopping feed instead of their own dashboard.
 */
export default function RoleRedirect() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Loading label="Loading" />;

  if (!isAuthenticated) return <Products />;

  const destination = ROLE_HOME[user?.role];

  // An unknown role has no home of its own; leave them on the marketplace.
  if (!destination) return <Products />;

  return <Navigate to={destination} replace />;
}
