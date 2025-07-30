import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, invalidateQueries } from '@/lib/query-client';
import { Commander, Ribbon, RibbonGenerationInput } from '@/lib/schemas';

// API client functions (to be implemented)
const apiClient = {
  // Commander API
  getCommanderProfile: async (commanderName: string): Promise<Commander> => {
    const response = await fetch(`/api/commander/profile/${commanderName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch commander profile');
    }
    return response.json();
  },

  syncInaraData: async (
    apiKey: string,
    commanderName?: string
  ): Promise<Commander> => {
    const response = await fetch('/api/sync/inara', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, commanderName }),
    });
    if (!response.ok) {
      throw new Error('Failed to sync Inara data');
    }
    return response.json();
  },

  // Ribbon API
  getRibbons: async (): Promise<Ribbon[]> => {
    const response = await fetch('/api/ribbons');
    if (!response.ok) {
      throw new Error('Failed to fetch ribbons');
    }
    return response.json();
  },

  generateRibbon: async (
    data: RibbonGenerationInput
  ): Promise<{ url: string }> => {
    const response = await fetch('/api/ribbons/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to generate ribbon');
    }
    return response.json();
  },

  // User API
  getUserPreferences: async () => {
    const response = await fetch('/api/user/preferences');
    if (!response.ok) {
      throw new Error('Failed to fetch user preferences');
    }
    return response.json();
  },

  updateUserPreferences: async (preferences: any) => {
    const response = await fetch('/api/user/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    if (!response.ok) {
      throw new Error('Failed to update user preferences');
    }
    return response.json();
  },
};

// Commander-related hooks
export function useCommanderProfile(commanderName: string) {
  return useQuery({
    queryKey: queryKeys.commanders.profile(commanderName),
    queryFn: () => apiClient.getCommanderProfile(commanderName),
    enabled: !!commanderName,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSyncInaraData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      apiKey,
      commanderName,
    }: {
      apiKey: string;
      commanderName?: string;
    }) => apiClient.syncInaraData(apiKey, commanderName),
    onSuccess: (data, variables) => {
      // Invalidate and refetch commander profile
      if (variables.commanderName) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.commanders.profile(variables.commanderName),
        });
      }
      // Invalidate all commander queries
      invalidateQueries.commanders();
    },
    onError: (error) => {
      console.error('Failed to sync Inara data:', error);
      // TODO: Show toast notification
    },
  });
}

// Ribbon-related hooks
export function useRibbons() {
  return useQuery({
    queryKey: queryKeys.ribbons.lists(),
    queryFn: apiClient.getRibbons,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useGenerateRibbon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.generateRibbon,
    onSuccess: (data, variables) => {
      // Invalidate ribbon generation cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.ribbons.generation(variables.commanderId),
      });
    },
    onError: (error) => {
      console.error('Failed to generate ribbon:', error);
      // TODO: Show toast notification
    },
  });
}

// User preferences hooks
export function useUserPreferences() {
  return useQuery({
    queryKey: queryKeys.users.preferences(),
    queryFn: apiClient.getUserPreferences,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.updateUserPreferences,
    onSuccess: () => {
      // Invalidate user preferences
      invalidateQueries.userPreferences();
    },
    onError: (error) => {
      console.error('Failed to update user preferences:', error);
      // TODO: Show toast notification
    },
  });
}

// Optimistic updates utility
export function useOptimisticUpdate<T>(
  queryKey: readonly unknown[],
  updateFn: (oldData: T | undefined) => T
) {
  const queryClient = useQueryClient();

  return (updater: (oldData: T | undefined) => T) => {
    queryClient.setQueryData(queryKey, updater);
  };
}

// Background refetch utility
export function useBackgroundRefetch<T>(
  queryKey: readonly unknown[],
  refetchInterval?: number
) {
  return useQuery({
    queryKey,
    refetchInterval,
    refetchIntervalInBackground: true,
  });
}

// Infinite query for paginated data
export function useInfiniteRibbons(pageSize = 20) {
  return useQuery({
    queryKey: queryKeys.ribbons.lists(),
    queryFn: ({ pageParam = 0 }) =>
      fetch(`/api/ribbons?page=${pageParam}&limit=${pageSize}`).then((res) =>
        res.json()
      ),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
