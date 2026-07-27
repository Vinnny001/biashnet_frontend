import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Landing from "../pages/public/Landing";
import Loading from "../components/common/Loading";

import { ROLE_HOME } from "../utils/roleRoutes";


export default function RoleRedirect() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Loading label="Loading" />;

  if (!isAuthenticated) return <Landing />;

  const destination = ROLE_HOME[user?.role] || "/";
  return <Navigate to={destination} replace />;
}