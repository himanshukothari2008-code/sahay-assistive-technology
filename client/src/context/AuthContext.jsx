import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await fetch('/api/v1/auth/me');
        if (res.ok) {
          const json = await res.json();
          setUser(json.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn('Session check warning:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    setUser(json.data);
    return json.data;
  };

  const register = async (name, email, password) => {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Registration failed');
    setUser(json.data);
    return json.data;
  };

  const logout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (e) {}
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      if (res.ok) {
        const json = await res.json();
        setUser(json.data);
      }
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
