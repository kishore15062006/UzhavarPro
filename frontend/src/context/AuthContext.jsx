// Authentication Context
import React, { useState, useCallback, useEffect } from 'react';
import AuthContext from './authCore.js';
import api from '../config/axios.js';
import { API_ENDPOINTS } from '../config/api.js';
import { Storage, handleApiError } from '../utils/index.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = Storage.getUser();
        const token = Storage.getToken();

        if (token && storedUser) {
          // Verify token validity
          try {
            await api.post(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
            setIsAuthenticated(true);
            try {
              const profileResponse = await api.get(API_ENDPOINTS.USERS.GET_PROFILE);
              const freshUser = profileResponse.data;
              Storage.setUser(freshUser);
              setUser(freshUser);
            } catch (profileErr) {
              console.warn('Could not fetch fresh profile, using stored data:', profileErr);
              setUser(storedUser);
            }
          } catch {
            // Token invalid, clear storage
            Storage.clearAll();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return { success: true };
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      const { user, token, refreshToken } = response.data;

      Storage.setToken(token);
      Storage.setRefreshToken(refreshToken);
      Storage.setUser(user);
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, data: user };
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      Storage.clearAll();
      Storage.removeCart();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      window.location.href = '/login';
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
      const updatedUser = response.data;

      Storage.setUser(updatedUser);
      setUser(updatedUser);

      return { success: true, data: updatedUser };
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLocation = useCallback(async (lat, lng, address) => {
    try {
      const response = await api.put(API_ENDPOINTS.USERS.UPDATE_LOCATION, {
        lat,
        lng,
        address,
      });
      const updatedUser = response.data;
      Storage.setUser(updatedUser);
      setUser(updatedUser);
      return { success: true, data: updatedUser };
    } catch (err) {
      return { success: false, error: handleApiError(err) };
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    updateProfile,
    updateLocation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
