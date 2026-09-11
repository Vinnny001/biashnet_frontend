import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { authService } from "../services/auth.service";
import { STORAGE_KEYS, USER_ROLES } from "../utils/constants";
import { getErrorMessage } from "../utils/errors";
import { storage } from "../utils/storage";
import { attachPushListeners, flushPendingDeviceToken, registerPushNotifications } from "../services/push";

export const AuthContext = createContext(null);

function extractAuthPayload(payload) {
  const data = payload?.data || payload;
  return {
    token: data?.token || data?.accessToken || data?.idToken || null,
    user: data?.user || data?.profile || data || null
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.USER));
  const [token, setToken] = useState(() => storage.get(STORAGE_KEYS.TOKEN));
  const [loading, setLoading] = useState(Boolean(storage.get(STORAGE_KEYS.TOKEN)));
  const [error, setError] = useState("");

  const persistSession = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      storage.set(STORAGE_KEYS.TOKEN, nextToken);
      setToken(nextToken);
    }

    if (nextUser) {
      storage.set(STORAGE_KEYS.USER, nextUser);
      setUser(nextUser);
    }
  }, []);

  const clearSession = useCallback(() => {
    storage.clearAuth([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!storage.get(STORAGE_KEYS.TOKEN)) {
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      const payload = await authService.me();
      const nextUser = payload?.data?.user || payload?.user || payload?.data || payload;
      if (nextUser) {
        storage.set(STORAGE_KEYS.USER, nextUser);
        setUser(nextUser);
      }
      return nextUser;
    } catch (err) {
      clearSession();
      setError(getErrorMessage(err, "Your session expired."));
      return null;
    } finally {
      setLoading(false);
    }


  }, [clearSession]);

  const login = useCallback(
    async (credentials) => {
      setError("");
      const payload = await authService.login(credentials);
      const session = extractAuthPayload(payload);
      persistSession(session.token, session.user);
      return session.user;
    },
    [persistSession]
  );

  const completeLogin = useCallback(
  (session) => {
    const { token, user } = extractAuthPayload(session);
    persistSession(token, user);
  },
  [persistSession]
);
  /*
   * Swap the active account (buyer <-> seller) without re-authenticating.
   * The backend rejects privileged targets, so a rejection here is
   * expected behaviour, not a bug — surface its message to the user.
   */
  const switchAccount = useCallback(
    async (accountType) => {
      setError("");
      const payload = await authService.switchAccount(accountType);
      const session = extractAuthPayload(payload);
      persistSession(session.token, session.user);
      return session.user;
    },
    [persistSession]
  );

  const signup = useCallback(
    async (values) => {
      setError("");
      const payload = await authService.signup(values);
      const session = extractAuthPayload(payload);
      persistSession(session.token, session.user);
      return session.user;
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // The client should still clear local state if the server logout fails.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    refreshUser();

    const onUnauthorized = () => clearSession();
    window.addEventListener("biashnet:unauthorized", onUnauthorized);

    // No-ops entirely on web — only does anything inside the Android app.
    attachPushListeners({ isAuthenticated: () => Boolean(storage.get(STORAGE_KEYS.TOKEN)) });
    registerPushNotifications();

    return () => window.removeEventListener("biashnet:unauthorized", onUnauthorized);
  }, [clearSession, refreshUser]);

  // Once a session exists, sync a device token the "registration" event
  // may have already delivered before login finished.
  useEffect(() => {
    if (user && token) {
      flushPendingDeviceToken();
    }
  }, [user, token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === USER_ROLES.ADMIN || Boolean(user?.isAdmin),
      isSeller: user?.role === USER_ROLES.SELLER || Boolean(user?.isSeller),
      login,
      signup,
      logout,
      refreshUser,
      setUser,
      completeLogin,
      switchAccount
    }),
    [error, loading, login, logout, refreshUser, signup, token, user, completeLogin, switchAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
