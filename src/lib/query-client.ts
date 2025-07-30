import { QueryClient } from '@tanstack/react-query';

// Default query options for the application
export const defaultQueryOptions = {
  // Default stale time - data is considered fresh for 5 minutes
  staleTime: 5 * 60 * 1000, // 5 minutes

  // Default cache time - data stays in cache for 10 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

  // Retry failed requests up to 3 times
  retry: 3,

  // Retry delay with exponential backoff
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),

  // Refetch on window focus (useful for real-time data)
  refetchOnWindowFocus: false,

  // Refetch on reconnect
  refetchOnReconnect: true,

  // Refetch on mount
  refetchOnMount: true,
};

// Create the query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...defaultQueryOptions,
      // Custom error handling for queries
      onError: (error) => {
        console.error('Query error:', error);
        // TODO: Add error reporting service (Sentry, etc.)
      },
    },
    mutations: {
      // Default mutation options
      retry: 1,
      retryDelay: 1000,

      // Custom error handling for mutations
      onError: (error) => {
        console.error('Mutation error:', error);
        // TODO: Add error reporting service (Sentry, etc.)
      },
    },
  },
});

// Query keys factory for type-safe query keys
export const queryKeys = {
  // Commander-related queries
  commanders: {
    all: ['commanders'] as const,
    lists: () => [...queryKeys.commanders.all, 'list'] as const,
    list: (filters: string) =>
      [...queryKeys.commanders.lists(), { filters }] as const,
    details: () => [...queryKeys.commanders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.commanders.details(), id] as const,
    profile: (commanderName: string) =>
      [...queryKeys.commanders.details(), 'profile', commanderName] as const,
  },

  // Inara API queries
  inara: {
    all: ['inara'] as const,
    profile: (commanderName: string) =>
      [...queryKeys.inara.all, 'profile', commanderName] as const,
    sync: (commanderName: string) =>
      [...queryKeys.inara.all, 'sync', commanderName] as const,
  },

  // Ribbon-related queries
  ribbons: {
    all: ['ribbons'] as const,
    lists: () => [...queryKeys.ribbons.all, 'list'] as const,
    list: (filters: string) =>
      [...queryKeys.ribbons.lists(), { filters }] as const,
    details: () => [...queryKeys.ribbons.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.ribbons.details(), id] as const,
    types: () => [...queryKeys.ribbons.all, 'types'] as const,
    generation: (commanderId: string) =>
      [...queryKeys.ribbons.all, 'generation', commanderId] as const,
  },

  // User-related queries
  users: {
    all: ['users'] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
    preferences: () => [...queryKeys.users.all, 'preferences'] as const,
    auth: () => [...queryKeys.users.all, 'auth'] as const,
  },

  // Authentication queries
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },

  // File upload queries
  uploads: {
    all: ['uploads'] as const,
    ribbon: (id: string) => [...queryKeys.uploads.all, 'ribbon', id] as const,
  },
} as const;

// Utility functions for query invalidation
export const invalidateQueries = {
  // Invalidate all commander-related queries
  commanders: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.commanders.all }),

  // Invalidate specific commander
  commander: (id: string) =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.commanders.detail(id),
    }),

  // Invalidate all ribbon-related queries
  ribbons: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.ribbons.all }),

  // Invalidate specific ribbon
  ribbon: (id: string) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.ribbons.detail(id) }),

  // Invalidate user preferences
  userPreferences: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.users.preferences() }),

  // Invalidate authentication
  auth: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
};

// Prefetch utilities for better UX
export const prefetchQueries = {
  // Prefetch commander profile
  commanderProfile: async (commanderName: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.commanders.profile(commanderName),
      queryFn: () => Promise.resolve(null), // Will be implemented with actual API call
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },

  // Prefetch ribbon types
  ribbonTypes: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.ribbons.types(),
      queryFn: () => Promise.resolve(null), // Will be implemented with actual API call
      staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
    });
  },
};

export default queryClient;
