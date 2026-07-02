import { useState, useCallback, useEffect, type ReactNode } from "react";
import { AuthContext, type ContextUser } from "./AuthContext";
import { authService } from "../services/auth.service";
import type { User } from "../types/user";
import type { AuthUser } from "../types/admin";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<ContextUser | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(false);
  }, []);

  const loginUser = useCallback(
    async (email: string, password: string): Promise<ContextUser> => {
      const { data } = await authService.loginUser({ email, password });
      const { access_token, user: userData } = data.data as {
        access_token: string;
        user: User;
      };

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      return userData;
    },
    [],
  );

  const loginAdmin = useCallback(
    async (email: string, password: string): Promise<AuthUser> => {
      const { data } = await authService.loginAdmin({ email, password });
      const { access_token, user: userData } = data.data as {
        access_token: string;
        user: AuthUser;
      };

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser({ ...userData, role: "admin" });
      return userData;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, loginUser, loginAdmin, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}
