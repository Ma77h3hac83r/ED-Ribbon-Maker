import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { Commander } from '@/lib/schemas';

// Commander state interface
export interface CommanderState {
  // Current commander
  currentCommander: Commander | null;

  // Commander list
  commanders: Commander[];
  isLoading: boolean;

  // Inara integration
  inaraApiKey: string | null;
  inaraConnected: boolean;
  lastSyncTime: Date | null;
  syncInProgress: boolean;

  // Commander search
  searchQuery: string;
  searchResults: Commander[];
  isSearching: boolean;

  // Commander favorites
  favoriteCommanders: string[]; // Array of commander IDs

  // Error handling
  error: string | null;
}

// Commander actions interface
export interface CommanderActions {
  // Current commander actions
  setCurrentCommander: (commander: Commander | null) => void;
  updateCurrentCommander: (updates: Partial<Commander>) => void;

  // Commander list actions
  setCommanders: (commanders: Commander[]) => void;
  addCommander: (commander: Commander) => void;
  updateCommander: (id: string, updates: Partial<Commander>) => void;
  removeCommander: (id: string) => void;
  setIsLoading: (loading: boolean) => void;

  // Inara integration actions
  setInaraApiKey: (apiKey: string | null) => void;
  setInaraConnected: (connected: boolean) => void;
  setLastSyncTime: (time: Date | null) => void;
  setSyncInProgress: (inProgress: boolean) => void;
  syncWithInara: (commanderName?: string) => Promise<boolean>;

  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Commander[]) => void;
  setIsSearching: (searching: boolean) => void;
  searchCommanders: (query: string) => Promise<void>;
  clearSearch: () => void;

  // Favorites actions
  addToFavorites: (commanderId: string) => void;
  removeFromFavorites: (commanderId: string) => void;
  toggleFavorite: (commanderId: string) => void;
  isFavorite: (commanderId: string) => boolean;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Utility actions
  resetCommanderState: () => void;
  refreshCommanderData: (commanderId: string) => Promise<void>;
}

// Combined state and actions type
export type CommanderStore = CommanderState & CommanderActions;

// Initial state
const initialState: CommanderState = {
  currentCommander: null,
  commanders: [],
  isLoading: false,
  inaraApiKey: null,
  inaraConnected: false,
  lastSyncTime: null,
  syncInProgress: false,
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  favoriteCommanders: [],
  error: null,
};

// Create the commander store
export const useCommanderStore = create<CommanderStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Current commander actions
        setCurrentCommander: (commander: Commander | null) => {
          set({ currentCommander: commander });
        },

        updateCurrentCommander: (updates: Partial<Commander>) => {
          const { currentCommander } = get();
          if (currentCommander) {
            set({ currentCommander: { ...currentCommander, ...updates } });
          }
        },

        // Commander list actions
        setCommanders: (commanders: Commander[]) => {
          set({ commanders });
        },

        addCommander: (commander: Commander) => {
          const { commanders } = get();
          if (!commanders.find((c) => c.id === commander.id)) {
            set({ commanders: [...commanders, commander] });
          }
        },

        updateCommander: (id: string, updates: Partial<Commander>) => {
          const { commanders } = get();
          set({
            commanders: commanders.map((c) =>
              c.id === id ? { ...c, ...updates } : c
            ),
          });
        },

        removeCommander: (id: string) => {
          const { commanders } = get();
          set({ commanders: commanders.filter((c) => c.id !== id) });
        },

        setIsLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        // Inara integration actions
        setInaraApiKey: (apiKey: string | null) => {
          set({ inaraApiKey: apiKey });
        },

        setInaraConnected: (connected: boolean) => {
          set({ inaraConnected: connected });
        },

        setLastSyncTime: (time: Date | null) => {
          set({ lastSyncTime: time });
        },

        setSyncInProgress: (inProgress: boolean) => {
          set({ syncInProgress: inProgress });
        },

        syncWithInara: async (commanderName?: string) => {
          const { inaraApiKey } = get();
          if (!inaraApiKey) return false;

          set({ syncInProgress: true, error: null });

          try {
            // TODO: Implement actual API call
            const response = await fetch('/api/sync/inara', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                apiKey: inaraApiKey,
                commanderName,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to sync with Inara');
            }

            const data = await response.json();

            // Update commander data
            get().updateCommander(data.commander.id, data.commander);

            set({
              lastSyncTime: new Date(),
              syncInProgress: false,
              error: null,
            });

            return true;
          } catch (error) {
            set({
              syncInProgress: false,
              error: error instanceof Error ? error.message : 'Sync failed',
            });
            return false;
          }
        },

        // Search actions
        setSearchQuery: (query: string) => {
          set({ searchQuery: query });
        },

        setSearchResults: (results: Commander[]) => {
          set({ searchResults: results });
        },

        setIsSearching: (searching: boolean) => {
          set({ isSearching: searching });
        },

        searchCommanders: async (query: string) => {
          if (!query.trim()) {
            set({ searchResults: [], isSearching: false });
            return;
          }

          set({ isSearching: true, error: null });

          try {
            // TODO: Implement actual API call
            const response = await fetch(
              `/api/commanders/search?q=${encodeURIComponent(query)}`
            );

            if (!response.ok) {
              throw new Error('Search failed');
            }

            const results = await response.json();
            set({ searchResults: results, isSearching: false });
          } catch (error) {
            set({
              isSearching: false,
              error: error instanceof Error ? error.message : 'Search failed',
            });
          }
        },

        clearSearch: () => {
          set({ searchQuery: '', searchResults: [], isSearching: false });
        },

        // Favorites actions
        addToFavorites: (commanderId: string) => {
          const { favoriteCommanders } = get();
          if (!favoriteCommanders.includes(commanderId)) {
            set({ favoriteCommanders: [...favoriteCommanders, commanderId] });
          }
        },

        removeFromFavorites: (commanderId: string) => {
          const { favoriteCommanders } = get();
          set({
            favoriteCommanders: favoriteCommanders.filter(
              (id) => id !== commanderId
            ),
          });
        },

        toggleFavorite: (commanderId: string) => {
          const { favoriteCommanders } = get();
          if (favoriteCommanders.includes(commanderId)) {
            get().removeFromFavorites(commanderId);
          } else {
            get().addToFavorites(commanderId);
          }
        },

        isFavorite: (commanderId: string) => {
          const { favoriteCommanders } = get();
          return favoriteCommanders.includes(commanderId);
        },

        // Error handling
        setError: (error: string | null) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        // Utility actions
        resetCommanderState: () => {
          set({
            currentCommander: null,
            commanders: [],
            isLoading: false,
            searchQuery: '',
            searchResults: [],
            isSearching: false,
            error: null,
          });
        },

        refreshCommanderData: async (commanderId: string) => {
          try {
            // TODO: Implement actual API call
            const response = await fetch(`/api/commanders/${commanderId}`);

            if (!response.ok) {
              throw new Error('Failed to refresh commander data');
            }

            const commander = await response.json();
            get().updateCommander(commanderId, commander);
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Refresh failed',
            });
          }
        },
      }),
      {
        name: 'ed-ribbon-maker-commander',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          commanders: state.commanders,
          inaraApiKey: state.inaraApiKey,
          inaraConnected: state.inaraConnected,
          lastSyncTime: state.lastSyncTime,
          favoriteCommanders: state.favoriteCommanders,
        }),
      }
    ),
    {
      name: 'commander-store',
    }
  )
);
