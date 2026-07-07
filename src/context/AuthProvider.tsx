import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { AuthContext, type ContextUser } from "./AuthContext";
import { authService } from "../services/auth.service";
import type { User } from "../types/user";
import type { AuthUser } from "../types/admin";
import { queryClient } from "../main";

const AUTH_CHANNEL = "auth-channel";

interface AuthMessage {
  type: "login" | "logout";
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<ContextUser | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channel.current = new BroadcastChannel(AUTH_CHANNEL);

    const handleMessage = (event: MessageEvent<AuthMessage>) => {
      const { type } = event.data;
      if (type === "logout") {
        setUser(null);
        queryClient.clear();
      }
    };

    channel.current.addEventListener("message", handleMessage);

    return () => {
      channel.current?.removeEventListener("message", handleMessage);
      channel.current?.close();
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(false);
  }, []);

  const postAuthMessage = useCallback((msg: AuthMessage) => {
    channel.current?.postMessage(msg);
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
      queryClient.clear();
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
      queryClient.clear();
      return userData;
    },
    [],
  );

  const loginAsUser = useCallback(
    async (userId: string): Promise<ContextUser> => {
      const { data } = await authService.loginAsUser(userId);
      const { access_token, user: userData } = data.data as {
        access_token: string;
        user: User;
      };

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      queryClient.clear();
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
      queryClient.clear();
      postAuthMessage({ type: "logout" });
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        loginAdmin,
        loginAsUser,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
