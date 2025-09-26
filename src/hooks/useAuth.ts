'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials } from '@/types/user';
import { userStorage } from '@/lib/storage';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se há usuário logado ao carregar
  useEffect(() => {
    const currentUser = userStorage.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const foundUser = userStorage.findByUsername(credentials.username);
      
      if (!foundUser) {
        return { success: false, error: 'Usuário não encontrado' };
      }
      
      if (foundUser.password !== credentials.password) {
        return { success: false, error: 'Senha incorreta' };
      }
      
      // Atualizar token e data de atualização
      const updatedUser: User = {
        ...foundUser,
        token: userStorage.generateToken(),
        updatedAt: new Date(),
      };
      
      userStorage.saveUser(updatedUser);
      userStorage.setCurrentUser(updatedUser);
      
      setUser(updatedUser);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    userStorage.setCurrentUser(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Registrar novo usuário
  const register = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const existingUser = userStorage.findByUsername(credentials.username);
      
      if (existingUser) {
        return { success: false, error: 'Nome de usuário já existe' };
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        username: credentials.username,
        password: credentials.password,
        token: userStorage.generateToken(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      userStorage.saveUser(newUser);
      userStorage.setCurrentUser(newUser);
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao criar usuário' };
    }
  }, []);

  // Recuperar conta por token
  const recoverByToken = useCallback(async (token: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const foundUser = userStorage.findByToken(token);
      
      if (!foundUser) {
        return { success: false, error: 'Token inválido ou expirado' };
      }
      
      userStorage.setCurrentUser(foundUser);
      setUser(foundUser);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao recuperar conta' };
    }
  }, []);

  // Atualizar perfil do usuário
  const updateProfile = useCallback(async (updates: Partial<Pick<User, 'username' | 'password'>>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      // Verificar se o novo username já existe (se foi alterado)
      if (updates.username && updates.username !== user.username) {
        const existingUser = userStorage.findByUsername(updates.username);
        if (existingUser) {
          return { success: false, error: 'Nome de usuário já existe' };
        }
      }

      const updatedUser: User = {
        ...user,
        ...updates,
        updatedAt: new Date(),
      };

      userStorage.saveUser(updatedUser);
      userStorage.setCurrentUser(updatedUser);
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar perfil' };
    }
  }, [user]);

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