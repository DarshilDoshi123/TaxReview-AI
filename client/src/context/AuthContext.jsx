import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user credentials exist in localStorage
    const savedUser = localStorage.getItem('taxreview_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        // Set Axios default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
      } catch (err) {
        console.error('Failed to parse cached user:', err);
        localStorage.removeItem('taxreview_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/login', { email, password });
      const userData = response.data.data;
      
      setUser(userData);
      localStorage.setItem('taxreview_user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/register', { name, email, password, role });
      const userData = response.data.data;

      setUser(userData);
      localStorage.setItem('taxreview_user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Try again.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taxreview_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfileState = (updatedData) => {
    const newUserState = { ...user, ...updatedData };
    setUser(newUserState);
    localStorage.setItem('taxreview_user', JSON.stringify(newUserState));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
