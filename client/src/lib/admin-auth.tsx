import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AdminRole } from "@shared/schema";
import { apiFetch } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

export type AdminSessionUser = {
  id: string;
  username: string;
  role: AdminRole;
};

type AdminAuthContextValue = {
  loading: boolean;
  user: AdminSessionUser | null;
  role: AdminRole | null;
  refresh: () => Promise<AdminSessionUser | null>;
  setUser: (user: AdminSessionUser) => void;
  clearSession: () => void;
  logout: () => Promise<boolean>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUserState] = useState<AdminSessionUser | null>(null);

  const clearSession = useCallback(() => {
    setUserState(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/session");
      if (!res.ok) {
        clearSession();
        return null;
      }
      const data = await res.json();
      if (data.authenticated && data.role && data.user?.id) {
        const sessionUser: AdminSessionUser = {
          id: data.user.id,
          username: data.user.username,
          role: data.role,
        };
        setUserState(sessionUser);
        return sessionUser;
      }
      clearSession();
      return null;
    } catch {
      clearSession();
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const setUser = useCallback((next: AdminSessionUser) => {
    setUserState(next);
  }, []);

  const logout = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/logout", { method: "POST" });
      clearSession();
      queryClient.clear();
      return res.ok;
    } catch {
      clearSession();
      queryClient.clear();
      return false;
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      loading,
      user,
      role: user?.role ?? null,
      refresh,
      setUser,
      clearSession,
      logout,
    }),
    [loading, user, refresh, setUser, clearSession, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth harus dipakai di dalam AdminAuthProvider");
  }
  return ctx;
}
