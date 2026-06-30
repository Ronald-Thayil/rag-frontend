import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/auth.service';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password, role = 'user') => {
    const endpoint = role === 'admin'
      ? authService.loginAdmin
      : authService.loginUser;

    const { data } = await endpoint({ email, password });
    const { access_token, refresh_token, user: userData } = data.data;

    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
