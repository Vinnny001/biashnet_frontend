import { createContext, useCallback, useMemo, useState } from "react";
import { userService } from "../services/user.service";
import { normalizeList } from "../utils/helpers";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const payload = await userService.list(params);
      const list = normalizeList(payload);
      setUsers(list);
      return list;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ users, loading, fetchUsers, setUsers }),
    [fetchUsers, loading, users]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
