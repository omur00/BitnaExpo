import { SIGNOUT_MUTATION } from '@/utils/queries';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@apollo/client/react';

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
  const [authChecked, setAuthChecked] = useState(false);
  const [signOutMutation, { loading: logoutLoading }] = useMutation(SIGNOUT_MUTATION);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('jobPortalUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('jobPortalUser', JSON.stringify(userData));
    if (userData.role === 'admin') {
      router.push('/(admin)');
    } else {
      router.push('/(auth)/dashboard');
    }
  };

  const signup = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('jobPortalUser', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { data } = await signOutMutation();

      if (data?.signOut.success) {
        setUser(null);
        await AsyncStorage.removeItem('jobPortalUser');
        router.push('/(auth)');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    logoutLoading,
    loading,
    authChecked,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
