import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginApi, registerApi, getMeApi, logoutApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('wg_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('wg_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem('wg_user');
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on mount if token exists
  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      const storedToken = localStorage.getItem('wg_token');
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const data = await getMeApi();
        if (isMounted && data?.data?.user) {
          setUser(data.data.user);
          localStorage.setItem('wg_user', JSON.stringify(data.data.user));
        }
      } catch {
        // Token invalid or expired
        if (isMounted) {
          setToken(null);
          setUser(null);
          localStorage.removeItem('wg_token');
          localStorage.removeItem('wg_user');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifyToken();

    // Listen for auth expired event dispatched from Axios interceptor
    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('wg-auth-expired', handleAuthExpired);

    return () => {
      isMounted = false;
      window.removeEventListener('wg-auth-expired', handleAuthExpired);
    };
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    const data = await loginApi({ email, password });
    const { user: userData, accessToken } = data.data;

    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('wg_token', accessToken);
    localStorage.setItem('wg_user', JSON.stringify(userData));

    return { user: userData, token: accessToken };
  }, []);

  // Signup / Register handler
  const signup = useCallback(async (userData) => {
    const data = await registerApi(userData);
    const { user: newUser, accessToken } = data.data;

    setToken(accessToken);
    setUser(newUser);
    localStorage.setItem('wg_token', accessToken);
    localStorage.setItem('wg_user', JSON.stringify(newUser));

    return { user: newUser, token: accessToken };
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('wg_token');
      localStorage.removeItem('wg_user');
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    signup,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
