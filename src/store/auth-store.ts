'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials } from '@/types/user';
import { userStorage } from '@/lib/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  recoverByToken: (token: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<Pick<User, 'username' | 'password'>>) => Promise<{ success: boolean; error?: string }>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      initializeAuth: () => {
        // Inicializar usuário admin padrão se não existir
        userStorage.initializeDefaultUser();
        
        const currentUser = userStorage.getCurrentUser();
        set({
          user: currentUser,
          isAuthenticated: !!currentUser,
          isLoading: false,
        });
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      login: async (credentials: LoginCredentials) => {
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
          
          set({
            user: updatedUser,
            isAuthenticated: true,
          });
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Erro interno do servidor' };
        }
      },

      logout: () => {
        userStorage.setCurrentUser(null);
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      register: async (credentials: LoginCredentials) => {
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
          
          set({
            user: newUser,
            isAuthenticated: true,
          });
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Erro ao criar usuário' };
        }
      },

      recoverByToken: async (token: string) => {
        try {
          const foundUser = userStorage.findByToken(token);
          
          if (!foundUser) {
            return { success: false, error: 'Token inválido ou expirado' };
          }
          
          userStorage.setCurrentUser(foundUser);
          set({
            user: foundUser,
            isAuthenticated: true,
          });
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Erro ao recuperar conta' };
        }
      },

      updateProfile: async (updates: Partial<Pick<User, 'username' | 'password'>>) => {
        const { user } = get();
        
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
          
          set({ user: updatedUser });

          return { success: true };
        } catch (error) {
          return { success: false, error: 'Erro ao atualizar perfil' };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);