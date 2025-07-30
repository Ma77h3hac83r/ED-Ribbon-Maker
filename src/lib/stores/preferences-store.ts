import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { UserPreferences } from '@/lib/schemas';

// Preferences state interface
export interface PreferencesState {
  // User preferences
  preferences: UserPreferences;

  // Application settings
  settings: {
    // General
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';

    // Display
    compactMode: boolean;
    showAnimations: boolean;
    reduceMotion: boolean;

    // Performance
    enableCaching: boolean;
    cacheExpiry: number; // in minutes
    maxCacheSize: number; // in MB

    // Notifications
    enableNotifications: boolean;
    notificationSound: boolean;
    notificationPosition:
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left';

    // Privacy
    analyticsEnabled: boolean;
    telemetryEnabled: boolean;
    shareUsageData: boolean;
  };

  // Ribbon-specific preferences
  ribbonPreferences: {
    defaultLayout: 'horizontal' | 'vertical' | 'grid';
    defaultSpacing: number;
    defaultShowLabels: boolean;
    defaultShowDescriptions: boolean;
    defaultMaxRibbonsPerRow: number;
    autoSaveTemplates: boolean;
    templateAutoSaveInterval: number; // in minutes
  };

  // Export preferences
  exportPreferences: {
    defaultFormat: 'svg' | 'png';
    defaultSize: { width: number; height: number };
    defaultQuality: number;
    defaultIncludeMetadata: boolean;
    autoDownload: boolean;
    downloadLocation: string;
  };

  // Inara integration preferences
  inaraPreferences: {
    autoSync: boolean;
    syncInterval: number; // in hours
    syncOnStartup: boolean;
    syncOnLogin: boolean;
    backupApiKey: boolean;
  };

  // Error handling
  error: string | null;
}

// Preferences actions interface
export interface PreferencesActions {
  // User preferences actions
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;

  // Settings actions
  setSettings: (settings: Partial<PreferencesState['settings']>) => void;
  updateSetting: <K extends keyof PreferencesState['settings']>(
    key: K,
    value: PreferencesState['settings'][K]
  ) => void;
  resetSettings: () => void;

  // Ribbon preferences actions
  setRibbonPreferences: (
    preferences: Partial<PreferencesState['ribbonPreferences']>
  ) => void;
  updateRibbonPreference: <
    K extends keyof PreferencesState['ribbonPreferences'],
  >(
    key: K,
    value: PreferencesState['ribbonPreferences'][K]
  ) => void;
  resetRibbonPreferences: () => void;

  // Export preferences actions
  setExportPreferences: (
    preferences: Partial<PreferencesState['exportPreferences']>
  ) => void;
  updateExportPreference: <
    K extends keyof PreferencesState['exportPreferences'],
  >(
    key: K,
    value: PreferencesState['exportPreferences'][K]
  ) => void;
  resetExportPreferences: () => void;

  // Inara preferences actions
  setInaraPreferences: (
    preferences: Partial<PreferencesState['inaraPreferences']>
  ) => void;
  updateInaraPreference: <K extends keyof PreferencesState['inaraPreferences']>(
    key: K,
    value: PreferencesState['inaraPreferences'][K]
  ) => void;
  resetInaraPreferences: () => void;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Utility actions
  exportPreferences: () => string;
  importPreferences: (data: string) => boolean;
  resetAllPreferences: () => void;
}

// Combined state and actions type
export type PreferencesStore = PreferencesState & PreferencesActions;

// Initial state
const initialState: PreferencesState = {
  preferences: {
    ribbonLayout: {
      arrangement: 'horizontal',
      spacing: 10,
      showLabels: true,
      showDescriptions: false,
      maxRibbonsPerRow: 5,
    },
    displayOptions: {
      theme: 'auto',
      showRibbonNames: true,
      showRibbonDescriptions: false,
      autoSync: true,
      syncInterval: 6,
    },
    notifications: {
      emailNotifications: false,
      syncNotifications: true,
      achievementNotifications: true,
    },
  },
  settings: {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '24h',
    compactMode: false,
    showAnimations: true,
    reduceMotion: false,
    enableCaching: true,
    cacheExpiry: 30,
    maxCacheSize: 100,
    enableNotifications: true,
    notificationSound: true,
    notificationPosition: 'top-right',
    analyticsEnabled: true,
    telemetryEnabled: false,
    shareUsageData: false,
  },
  ribbonPreferences: {
    defaultLayout: 'horizontal',
    defaultSpacing: 10,
    defaultShowLabels: true,
    defaultShowDescriptions: false,
    defaultMaxRibbonsPerRow: 5,
    autoSaveTemplates: true,
    templateAutoSaveInterval: 5,
  },
  exportPreferences: {
    defaultFormat: 'svg',
    defaultSize: { width: 800, height: 400 },
    defaultQuality: 90,
    defaultIncludeMetadata: true,
    autoDownload: false,
    downloadLocation: 'downloads',
  },
  inaraPreferences: {
    autoSync: true,
    syncInterval: 6,
    syncOnStartup: true,
    syncOnLogin: true,
    backupApiKey: false,
  },
  error: null,
};

// Create the preferences store
export const usePreferencesStore = create<PreferencesStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // User preferences actions
        setPreferences: (preferences: UserPreferences) => {
          set({ preferences });
        },

        updatePreferences: (updates: Partial<UserPreferences>) => {
          const { preferences } = get();
          set({ preferences: { ...preferences, ...updates } });
        },

        resetPreferences: () => {
          set({ preferences: initialState.preferences });
        },

        // Settings actions
        setSettings: (settings: Partial<PreferencesState['settings']>) => {
          const { settings: currentSettings } = get();
          set({ settings: { ...currentSettings, ...settings } });
        },

        updateSetting: <K extends keyof PreferencesState['settings']>(
          key: K,
          value: PreferencesState['settings'][K]
        ) => {
          const { settings } = get();
          set({ settings: { ...settings, [key]: value } });
        },

        resetSettings: () => {
          set({ settings: initialState.settings });
        },

        // Ribbon preferences actions
        setRibbonPreferences: (
          preferences: Partial<PreferencesState['ribbonPreferences']>
        ) => {
          const { ribbonPreferences } = get();
          set({ ribbonPreferences: { ...ribbonPreferences, ...preferences } });
        },

        updateRibbonPreference: <
          K extends keyof PreferencesState['ribbonPreferences'],
        >(
          key: K,
          value: PreferencesState['ribbonPreferences'][K]
        ) => {
          const { ribbonPreferences } = get();
          set({ ribbonPreferences: { ...ribbonPreferences, [key]: value } });
        },

        resetRibbonPreferences: () => {
          set({ ribbonPreferences: initialState.ribbonPreferences });
        },

        // Export preferences actions
        setExportPreferences: (
          preferences: Partial<PreferencesState['exportPreferences']>
        ) => {
          const { exportPreferences } = get();
          set({ exportPreferences: { ...exportPreferences, ...preferences } });
        },

        updateExportPreference: <
          K extends keyof PreferencesState['exportPreferences'],
        >(
          key: K,
          value: PreferencesState['exportPreferences'][K]
        ) => {
          const { exportPreferences } = get();
          set({ exportPreferences: { ...exportPreferences, [key]: value } });
        },

        resetExportPreferences: () => {
          set({ exportPreferences: initialState.exportPreferences });
        },

        // Inara preferences actions
        setInaraPreferences: (
          preferences: Partial<PreferencesState['inaraPreferences']>
        ) => {
          const { inaraPreferences } = get();
          set({ inaraPreferences: { ...inaraPreferences, ...preferences } });
        },

        updateInaraPreference: <
          K extends keyof PreferencesState['inaraPreferences'],
        >(
          key: K,
          value: PreferencesState['inaraPreferences'][K]
        ) => {
          const { inaraPreferences } = get();
          set({ inaraPreferences: { ...inaraPreferences, [key]: value } });
        },

        resetInaraPreferences: () => {
          set({ inaraPreferences: initialState.inaraPreferences });
        },

        // Error handling
        setError: (error: string | null) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        // Utility actions
        exportPreferences: () => {
          const state = get();
          const exportData = {
            preferences: state.preferences,
            settings: state.settings,
            ribbonPreferences: state.ribbonPreferences,
            exportPreferences: state.exportPreferences,
            inaraPreferences: state.inaraPreferences,
            exportedAt: new Date().toISOString(),
          };
          return JSON.stringify(exportData, null, 2);
        },

        importPreferences: (data: string) => {
          try {
            const importData = JSON.parse(data);

            if (importData.preferences) {
              set({ preferences: importData.preferences });
            }
            if (importData.settings) {
              set({ settings: importData.settings });
            }
            if (importData.ribbonPreferences) {
              set({ ribbonPreferences: importData.ribbonPreferences });
            }
            if (importData.exportPreferences) {
              set({ exportPreferences: importData.exportPreferences });
            }
            if (importData.inaraPreferences) {
              set({ inaraPreferences: importData.inaraPreferences });
            }

            return true;
          } catch (error) {
            set({ error: 'Failed to import preferences' });
            return false;
          }
        },

        resetAllPreferences: () => {
          set({
            preferences: initialState.preferences,
            settings: initialState.settings,
            ribbonPreferences: initialState.ribbonPreferences,
            exportPreferences: initialState.exportPreferences,
            inaraPreferences: initialState.inaraPreferences,
            error: null,
          });
        },
      }),
      {
        name: 'ed-ribbon-maker-preferences',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          preferences: state.preferences,
          settings: state.settings,
          ribbonPreferences: state.ribbonPreferences,
          exportPreferences: state.exportPreferences,
          inaraPreferences: state.inaraPreferences,
        }),
      }
    ),
    {
      name: 'preferences-store',
    }
  )
);
