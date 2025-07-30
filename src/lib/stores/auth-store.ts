import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { User, LoginInput } from '@/lib/schemas';

// Authentication state interface
export interface AuthState {
  // User data
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Session management
  sessionToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;

  // Error handling
  error: string | null;

  // Inara integration
  inaraApiKey: string | null;
  inaraConnected: boolean;
}

// Authentication actions interface
export interface AuthActions {
  // Authentication actions
  login: (credentials: LoginInput) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  refreshSession: () => Promise<boolean>;

  // User management
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;

  // Session management
  setSession: (token: string, refreshToken: string, expiresAt: number) => void;
  clearSession: () => void;

  // Loading states
  setLoading: (loading: boolean) => void;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Inara integration
  setInaraApiKey: (apiKey: string | null) => void;
  setInaraConnected: (connected: boolean) => void;

  // Utility actions
  checkAuthStatus: () => boolean;
  isSessionValid: () => boolean;
}

// Combined state and actions type
export type AuthStore = AuthState & AuthActions;

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  sessionToken: null,
  refreshToken: null,
  expiresAt: null,
  error: null,
  inaraApiKey: null,
  inaraConnected: false,
};

// Create the auth store
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Authentication actions
        login: async (credentials: LoginInput) => {
          set({ isLoading: true, error: null });

          try {
            // TODO: Implement actual API call
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(credentials),
            });

            if (!response.ok) {
              throw new Error('Login failed');
            }

            const data = await response.json();

            set({
              user: data.user,
              isAuthenticated: true,
              sessionToken: data.token,
              refreshToken: data.refreshToken,
              expiresAt: Date.now() + data.expiresIn * 1000,
              isLoading: false,
              error: null,
            });

            return true;
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Login failed',
            });
            return false;
          }
        },

        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
            sessionToken: null,
            refreshToken: null,
            expiresAt: null,
            error: null,
            inaraApiKey: null,
            inaraConnected: false,
          });
        },

        register: async (userData: any) => {
          set({ isLoading: true, error: null });

          try {
            // TODO: Implement actual API call
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData),
            });

            if (!response.ok) {
              throw new Error('Registration failed');
            }

            const data = await response.json();

            set({
              user: data.user,
              isAuthenticated: true,
              sessionToken: data.token,
              refreshToken: data.refreshToken,
              expiresAt: Date.now() + data.expiresIn * 1000,
              isLoading: false,
              error: null,
            });

            return true;
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error ? error.message : 'Registration failed',
            });
            return false;
          }
        },

        refreshSession: async () => {
          const { refreshToken } = get();

          if (!refreshToken) {
            return false;
          }

          try {
            // TODO: Implement actual API call
            const response = await fetch('/api/auth/refresh', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
              throw new Error('Session refresh failed');
            }

            const data = await response.json();

            set({
              sessionToken: data.token,
              refreshToken: data.refreshToken,
              expiresAt: Date.now() + data.expiresIn * 1000,
            });

            return true;
          } catch (error) {
            // If refresh fails, logout the user
            get().logout();
            return false;
          }
        },

        // User management
        setUser: (user: User | null) => {
          set({ user, isAuthenticated: !!user });
        },

        updateUser: (updates: Partial<User>) => {
          const { user } = get();
          if (user) {
            set({ user: { ...user, ...updates } });
          }
        },

        // Session management
        setSession: (
          token: string,
          refreshToken: string,
          expiresAt: number
        ) => {
          set({
            sessionToken: token,
            refreshToken,
            expiresAt,
            isAuthenticated: true,
          });
        },

        clearSession: () => {
          set({
            sessionToken: null,
            refreshToken: null,
            expiresAt: null,
            isAuthenticated: false,
          });
        },

        // Loading states
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        // Error handling
        setError: (error: string | null) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        // Inara integration
        setInaraApiKey: (apiKey: string | null) => {
          set({ inaraApiKey: apiKey });
        },

        setInaraConnected: (connected: boolean) => {
          set({ inaraConnected: connected });
        },

        // Utility actions
        checkAuthStatus: () => {
          const { isAuthenticated, isSessionValid } = get();
          return isAuthenticated && isSessionValid();
        },

        isSessionValid: () => {
          const { expiresAt } = get();
          return expiresAt ? Date.now() < expiresAt : false;
        },
      }),
      {
        name: 'ed-ribbon-maker-auth',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          sessionToken: state.sessionToken,
          refreshToken: state.refreshToken,
          expiresAt: state.expiresAt,
          inaraApiKey: state.inaraApiKey,
          inaraConnected: state.inaraConnected,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);
