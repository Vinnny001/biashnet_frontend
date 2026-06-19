import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "../components/common/Loading";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading label="Checking your session" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
}
