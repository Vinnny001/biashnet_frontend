import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { employeeService } from "../services/employee.service";
import { useAuth } from "../hooks/useAuth";

export const EmployeeContext = createContext(null);

export function EmployeeProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [employee, setEmployee] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshEmployee = useCallback(async () => {
    if (!isAuthenticated) {
      setEmployee(null);
      setWallet(null);
      return null;
    }

    try {
      setLoading(true);
      const payload = await employeeService.me();
      setEmployee(payload?.employee || null);
      setWallet(payload?.wallet || null);
      return payload?.employee || null;
    } catch (err) {
      /*
       * A 403 here just means this account isn't an employee —
       * that's the normal case for buyers/sellers, not an error.
       */
      if (err?.response?.status !== 403) {
        console.error("Failed to load employee profile:", err);
      }
      setEmployee(null);
      setWallet(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshEmployee();
  }, [refreshEmployee]);

  const employeeRoles = employee?.roles || {};

  const hasRole = useCallback(
    (...roles) => {
      if (employeeRoles.admin === true) return true;
      return roles.some((role) => employeeRoles[role] === true);
    },
    [employeeRoles]
  );

  const value = useMemo(
    () => ({
      employee,
      wallet,
      employeeRoles,
      isEmployee: Boolean(employee),
      loading,
      hasRole,
      refreshEmployee
    }),
    [employee, wallet, employeeRoles, loading, hasRole, refreshEmployee]
  );

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}
