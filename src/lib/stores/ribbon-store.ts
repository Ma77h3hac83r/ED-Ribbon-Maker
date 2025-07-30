import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { Ribbon, RibbonLayout, RibbonGenerationInput } from '@/lib/schemas';

// Ribbon state interface
export interface RibbonState {
  // Current ribbon being edited
  currentRibbon: Ribbon | null;

  // Ribbon generation
  generationInput: RibbonGenerationInput | null;
  generatedRibbonUrl: string | null;
  isGenerating: boolean;

  // Ribbon editor
  selectedRibbons: Ribbon[];
  ribbonLayout: RibbonLayout;

  // Ribbon display
  ribbonDisplayMode: 'grid' | 'list' | 'preview';
  ribbonSortBy: 'name' | 'level' | 'type' | 'created';
  ribbonSortOrder: 'asc' | 'desc';

  // Ribbon filters
  ribbonFilters: {
    types: string[];
    minLevel: number | null;
    maxLevel: number | null;
    searchQuery: string;
  };

  // Ribbon history
  ribbonHistory: Array<{
    id: string;
    name: string;
    url: string;
    createdAt: Date;
    commanderName: string;
  }>;

  // Export settings
  exportSettings: {
    format: 'svg' | 'png';
    size: { width: number; height: number };
    quality: number;
    includeMetadata: boolean;
  };

  // Error handling
  error: string | null;
}

// Ribbon actions interface
export interface RibbonActions {
  // Current ribbon actions
  setCurrentRibbon: (ribbon: Ribbon | null) => void;
  updateCurrentRibbon: (updates: Partial<Ribbon>) => void;

  // Generation actions
  setGenerationInput: (input: RibbonGenerationInput | null) => void;
  updateGenerationInput: (updates: Partial<RibbonGenerationInput>) => void;
  generateRibbon: () => Promise<boolean>;
  setGeneratedRibbonUrl: (url: string | null) => void;
  setIsGenerating: (generating: boolean) => void;

  // Editor actions
  setSelectedRibbons: (ribbons: Ribbon[]) => void;
  addSelectedRibbon: (ribbon: Ribbon) => void;
  removeSelectedRibbon: (ribbonId: string) => void;
  clearSelectedRibbons: () => void;

  setRibbonLayout: (layout: RibbonLayout) => void;
  updateRibbonLayout: (updates: Partial<RibbonLayout>) => void;

  // Display actions
  setRibbonDisplayMode: (mode: 'grid' | 'list' | 'preview') => void;
  setRibbonSortBy: (sortBy: 'name' | 'level' | 'type' | 'created') => void;
  setRibbonSortOrder: (order: 'asc' | 'desc') => void;
  toggleRibbonSortOrder: () => void;

  // Filter actions
  setRibbonFilters: (filters: Partial<RibbonState['ribbonFilters']>) => void;
  addRibbonFilterType: (type: string) => void;
  removeRibbonFilterType: (type: string) => void;
  clearRibbonFilters: () => void;

  // History actions
  addToRibbonHistory: (ribbon: {
    id: string;
    name: string;
    url: string;
    commanderName: string;
  }) => void;
  removeFromRibbonHistory: (id: string) => void;
  clearRibbonHistory: () => void;

  // Export actions
  setExportSettings: (settings: Partial<RibbonState['exportSettings']>) => void;
  setExportFormat: (format: 'svg' | 'png') => void;
  setExportSize: (size: { width: number; height: number }) => void;
  setExportQuality: (quality: number) => void;
  setIncludeMetadata: (include: boolean) => void;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Utility actions
  resetRibbonState: () => void;
  saveRibbonTemplate: (name: string) => void;
  loadRibbonTemplate: (templateId: string) => void;
}

// Combined state and actions type
export type RibbonStore = RibbonState & RibbonActions;

// Initial state
const initialState: RibbonState = {
  currentRibbon: null,
  generationInput: null,
  generatedRibbonUrl: null,
  isGenerating: false,
  selectedRibbons: [],
  ribbonLayout: {
    arrangement: 'horizontal',
    spacing: 10,
    showLabels: true,
    showDescriptions: false,
    maxRibbonsPerRow: 5,
  },
  ribbonDisplayMode: 'grid',
  ribbonSortBy: 'name',
  ribbonSortOrder: 'asc',
  ribbonFilters: {
    types: [],
    minLevel: null,
    maxLevel: null,
    searchQuery: '',
  },
  ribbonHistory: [],
  exportSettings: {
    format: 'svg',
    size: { width: 800, height: 400 },
    quality: 90,
    includeMetadata: true,
  },
  error: null,
};

// Create the ribbon store
export const useRibbonStore = create<RibbonStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Current ribbon actions
        setCurrentRibbon: (ribbon: Ribbon | null) => {
          set({ currentRibbon: ribbon });
        },

        updateCurrentRibbon: (updates: Partial<Ribbon>) => {
          const { currentRibbon } = get();
          if (currentRibbon) {
            set({ currentRibbon: { ...currentRibbon, ...updates } });
          }
        },

        // Generation actions
        setGenerationInput: (input: RibbonGenerationInput | null) => {
          set({ generationInput: input });
        },

        updateGenerationInput: (updates: Partial<RibbonGenerationInput>) => {
          const { generationInput } = get();
          if (generationInput) {
            set({ generationInput: { ...generationInput, ...updates } });
          }
        },

        generateRibbon: async () => {
          const { generationInput } = get();
          if (!generationInput) return false;

          set({ isGenerating: true, error: null });

          try {
            // TODO: Implement actual API call
            const response = await fetch('/api/ribbons/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(generationInput),
            });

            if (!response.ok) {
              throw new Error('Failed to generate ribbon');
            }

            const data = await response.json();

            set({
              generatedRibbonUrl: data.url,
              isGenerating: false,
              error: null,
            });

            // Add to history
            get().addToRibbonHistory({
              id: Math.random().toString(36).substr(2, 9),
              name: `Ribbon for ${generationInput.commanderId}`,
              url: data.url,
              commanderName: generationInput.commanderId,
            });

            return true;
          } catch (error) {
            set({
              isGenerating: false,
              error:
                error instanceof Error ? error.message : 'Generation failed',
            });
            return false;
          }
        },

        setGeneratedRibbonUrl: (url: string | null) => {
          set({ generatedRibbonUrl: url });
        },

        setIsGenerating: (generating: boolean) => {
          set({ isGenerating: generating });
        },

        // Editor actions
        setSelectedRibbons: (ribbons: Ribbon[]) => {
          set({ selectedRibbons: ribbons });
        },

        addSelectedRibbon: (ribbon: Ribbon) => {
          const { selectedRibbons } = get();
          if (!selectedRibbons.find((r) => r.id === ribbon.id)) {
            set({ selectedRibbons: [...selectedRibbons, ribbon] });
          }
        },

        removeSelectedRibbon: (ribbonId: string) => {
          const { selectedRibbons } = get();
          set({
            selectedRibbons: selectedRibbons.filter((r) => r.id !== ribbonId),
          });
        },

        clearSelectedRibbons: () => {
          set({ selectedRibbons: [] });
        },

        setRibbonLayout: (layout: RibbonLayout) => {
          set({ ribbonLayout: layout });
        },

        updateRibbonLayout: (updates: Partial<RibbonLayout>) => {
          const { ribbonLayout } = get();
          set({ ribbonLayout: { ...ribbonLayout, ...updates } });
        },

        // Display actions
        setRibbonDisplayMode: (mode: 'grid' | 'list' | 'preview') => {
          set({ ribbonDisplayMode: mode });
        },

        setRibbonSortBy: (sortBy: 'name' | 'level' | 'type' | 'created') => {
          set({ ribbonSortBy: sortBy });
        },

        setRibbonSortOrder: (order: 'asc' | 'desc') => {
          set({ ribbonSortOrder: order });
        },

        toggleRibbonSortOrder: () => {
          const { ribbonSortOrder } = get();
          set({ ribbonSortOrder: ribbonSortOrder === 'asc' ? 'desc' : 'asc' });
        },

        // Filter actions
        setRibbonFilters: (filters: Partial<RibbonState['ribbonFilters']>) => {
          const { ribbonFilters } = get();
          set({ ribbonFilters: { ...ribbonFilters, ...filters } });
        },

        addRibbonFilterType: (type: string) => {
          const { ribbonFilters } = get();
          if (!ribbonFilters.types.includes(type)) {
            set({
              ribbonFilters: {
                ...ribbonFilters,
                types: [...ribbonFilters.types, type],
              },
            });
          }
        },

        removeRibbonFilterType: (type: string) => {
          const { ribbonFilters } = get();
          set({
            ribbonFilters: {
              ...ribbonFilters,
              types: ribbonFilters.types.filter((t) => t !== type),
            },
          });
        },

        clearRibbonFilters: () => {
          set({
            ribbonFilters: {
              types: [],
              minLevel: null,
              maxLevel: null,
              searchQuery: '',
            },
          });
        },

        // History actions
        addToRibbonHistory: (ribbon) => {
          const { ribbonHistory } = get();
          const newEntry = {
            ...ribbon,
            createdAt: new Date(),
          };

          // Remove oldest entry if history is too long (keep last 20)
          const updatedHistory = [...ribbonHistory, newEntry].slice(-20);
          set({ ribbonHistory: updatedHistory });
        },

        removeFromRibbonHistory: (id: string) => {
          const { ribbonHistory } = get();
          set({ ribbonHistory: ribbonHistory.filter((r) => r.id !== id) });
        },

        clearRibbonHistory: () => {
          set({ ribbonHistory: [] });
        },

        // Export actions
        setExportSettings: (
          settings: Partial<RibbonState['exportSettings']>
        ) => {
          const { exportSettings } = get();
          set({ exportSettings: { ...exportSettings, ...settings } });
        },

        setExportFormat: (format: 'svg' | 'png') => {
          const { exportSettings } = get();
          set({ exportSettings: { ...exportSettings, format } });
        },

        setExportSize: (size: { width: number; height: number }) => {
          const { exportSettings } = get();
          set({ exportSettings: { ...exportSettings, size } });
        },

        setExportQuality: (quality: number) => {
          const { exportSettings } = get();
          set({ exportSettings: { ...exportSettings, quality } });
        },

        setIncludeMetadata: (include: boolean) => {
          const { exportSettings } = get();
          set({
            exportSettings: { ...exportSettings, includeMetadata: include },
          });
        },

        // Error handling
        setError: (error: string | null) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        // Utility actions
        resetRibbonState: () => {
          set({
            currentRibbon: null,
            generationInput: null,
            generatedRibbonUrl: null,
            isGenerating: false,
            selectedRibbons: [],
            error: null,
          });
        },

        saveRibbonTemplate: (name: string) => {
          const { ribbonLayout, selectedRibbons, exportSettings } = get();
          const template = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            layout: ribbonLayout,
            ribbons: selectedRibbons,
            exportSettings,
            createdAt: new Date(),
          };

          // TODO: Save template to localStorage or API
          console.log('Saving template:', template);
        },

        loadRibbonTemplate: (templateId: string) => {
          // TODO: Load template from localStorage or API
          console.log('Loading template:', templateId);
        },
      }),
      {
        name: 'ed-ribbon-maker-ribbon',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          ribbonLayout: state.ribbonLayout,
          ribbonDisplayMode: state.ribbonDisplayMode,
          ribbonSortBy: state.ribbonSortBy,
          ribbonSortOrder: state.ribbonSortOrder,
          ribbonFilters: state.ribbonFilters,
          ribbonHistory: state.ribbonHistory,
          exportSettings: state.exportSettings,
        }),
      }
    ),
    {
      name: 'ribbon-store',
    }
  )
);
