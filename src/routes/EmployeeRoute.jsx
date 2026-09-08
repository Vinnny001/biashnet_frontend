import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/common/Loading";
import { useAuth } from "../hooks/useAuth";
import { useEmployee } from "../hooks/useEmployee";

export default function EmployeeRoute({ allow = [], children }) {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const { loading: employeeLoading, isEmployee, hasRole } = useEmployee();

  if (authLoading || employeeLoading) {
    return <Loading label="Checking permissions" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isEmployee) {
    return <Navigate to="/" replace />;
  }

  if (allow.length && !hasRole(...allow)) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  return children || <Outlet />;
}
