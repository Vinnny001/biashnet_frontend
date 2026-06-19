import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/common/Loading";
import { useAuth } from "../hooks/useAuth";

export default function RoleRoute({ allow = [], children }) {
  const { user, loading, isAuthenticated, isAdmin, isSeller } = useAuth();

  if (loading) return <Loading label="Checking permissions" />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const allowed =
    !allow.length ||
    allow.includes(user?.role) ||
    (allow.includes("admin") && isAdmin) ||
    (allow.includes("seller") && isSeller);

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
}
