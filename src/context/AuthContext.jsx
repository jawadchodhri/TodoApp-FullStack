import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      setLoading(true);
      const token = localStorage.getItem('todo_token');
      // If no token exists locally, skip verification
      if (!token) {
        setUser(null);
        return;
      }
      const data = await apiRequest('/auth/me');
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem('todo_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data.token) {
      localStorage.setItem('todo_token', data.token);
    }
    setUser(data.user);
    return data;
  }

  async function register(name, email, password) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    if (data.token) {
      localStorage.setItem('todo_token', data.token);
    }
    setUser(data.user);
    return data;
  }

  async function logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore logout error
    } finally {
      localStorage.removeItem('todo_token');
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
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