import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState({
    accessToken: localStorage.getItem('travellite-access-token'),
    refreshToken: localStorage.getItem('travellite-refresh-token')
  });

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('travellite-access-token');
      
      if (accessToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.data.user);
          } else {
            // Token is invalid, clear it
            clearAuthData();
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          clearAuthData();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Clear auth data
  const clearAuthData = () => {
    localStorage.removeItem('travellite-access-token');
    localStorage.removeItem('travellite-refresh-token');
    setUser(null);
    setTokens({ accessToken: null, refreshToken: null });
  };

  // Store auth data
  const storeAuthData = (userData, tokenData) => {
    localStorage.setItem('travellite-access-token', tokenData.accessToken);
    localStorage.setItem('travellite-refresh-token', tokenData.refreshToken);
    setUser(userData);
    setTokens(tokenData);
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('🚀 Attempting registration with:', { email: userData.email, firstName: userData.firstName });
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      console.log('📡 Registration response status:', response.status);
      const data = await response.json();
      console.log('📄 Registration response data:', data);

      if (response.ok) {
        console.log('✅ Registration successful, storing auth data');
        storeAuthData(data.data.user, data.data.tokens);
        return { success: true, data: data.data };
      } else {
        console.log('❌ Registration failed:', data.message);
        return { success: false, error: data.message, errors: data.errors };
      }
    } catch (error) {
      console.error('❌ Registration network error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting login with:', { email });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('📡 Login response status:', response.status);
      const data = await response.json();
      console.log('📄 Login response data:', data);

      if (response.ok) {
        console.log('✅ Login successful, storing auth data');
        storeAuthData(data.data.user, data.data.tokens);
        return { success: true, data: data.data };
      } else {
        console.log('❌ Login failed:', data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('❌ Login network error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (tokens.accessToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data.user);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.message, errors: data.errors };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message, errors: data.errors };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    tokens
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
