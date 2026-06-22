import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Landing from "../pages/public/Landing";
import Loading from "../components/common/Loading";

const ROLE_HOME = {
  admin: "/admin/dashboard",
  seller: "/seller/dashboard",
  investor: "/home",   // investors stay on buyer home for now — update when you have an investor portal
  buyer: "/home"
};

export default function RoleRedirect() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Loading label="Loading" />;

  if (!isAuthenticated) return <Landing />;

  const destination = ROLE_HOME[user?.role] || "/";
  return <Navigate to={destination} replace />;
}