import { createContext, useCallback, useMemo, useState } from "react";

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const notify = useCallback((message, severity = "info") => {
    setNotification({ message, severity, id: Date.now() });
  }, []);

  const clear = useCallback(() => setNotification(null), []);

  const value = useMemo(
    () => ({ notification, notify, clear }),
    [clear, notification, notify]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
