'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    recoverByToken,
    updateProfile,
    initializeAuth,
  } = useAuthStore();

  // Inicializar autenticação ao carregar
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    recoverByToken,
    updateProfile,
  };
}