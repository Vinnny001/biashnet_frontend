import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { employeeService } from "../services/employee.service";
import { useAuth } from "../hooks/useAuth";
import { STORAGE_KEYS } from "../utils/constants";
import { storage } from "../utils/storage";

export const EmployeeContext = createContext(null);

export function EmployeeProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [employee, setEmployee] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRoleState] = useState(() => storage.get(STORAGE_KEYS.EMPLOYEE_ROLE) || null);

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

  /*
   * Every role this employee actually holds. The role they're currently
   * "wearing" (activeRole) only decides which dashboard/nav they see —
   * authorization is always re-checked server-side against these.
   */
  const availableRoles = useMemo(
    () =>
      Object.entries(employeeRoles)
        .filter(([, granted]) => granted === true)
        .map(([role]) => role),
    [employeeRoles]
  );

  const setActiveRole = useCallback((role) => {
    setActiveRoleState(role);
    storage.set(STORAGE_KEYS.EMPLOYEE_ROLE, role);
  }, []);

  /*
   * Keep activeRole honest: if it was never chosen, or points at a role
   * this employee no longer holds (revoked since last login), fall back
   * to the first role they do have.
   */
  useEffect(() => {
    if (!availableRoles.length) return;
    if (activeRole && availableRoles.includes(activeRole)) return;

    setActiveRole(availableRoles[0]);
  }, [availableRoles, activeRole, setActiveRole]);

  const value = useMemo(
    () => ({
      employee,
      wallet,
      employeeRoles,
      availableRoles,
      activeRole,
      setActiveRole,
      isEmployee: Boolean(employee),
      loading,
      hasRole,
      refreshEmployee
    }),
    [employee, wallet, employeeRoles, availableRoles, activeRole, setActiveRole, loading, hasRole, refreshEmployee]
  );

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}
