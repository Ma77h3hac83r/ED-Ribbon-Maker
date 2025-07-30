import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

// UI state interface
export interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'auto';

  // Layout
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Modals
  activeModals: string[];

  // Navigation
  currentPage: string;
  breadcrumbs: Array<{ label: string; href: string }>;

  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;

  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }>;

  // Ribbon editor
  ribbonEditorOpen: boolean;
  ribbonEditorMode: 'create' | 'edit' | 'preview';

  // Commander search
  commanderSearchOpen: boolean;
  commanderSearchQuery: string;

  // Preferences panel
  preferencesPanelOpen: boolean;
  preferencesActiveTab: string;
}

// UI actions interface
export interface UIActions {
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleTheme: () => void;

  // Layout actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;

  // Modal actions
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;

  // Navigation actions
  setCurrentPage: (page: string) => void;
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href: string }>) => void;
  addBreadcrumb: (breadcrumb: { label: string; href: string }) => void;
  clearBreadcrumbs: () => void;

  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  setLoadingState: (key: string, loading: boolean) => void;
  clearLoadingState: (key: string) => void;
  clearAllLoadingStates: () => void;

  // Notification actions
  addNotification: (notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Ribbon editor actions
  setRibbonEditorOpen: (open: boolean) => void;
  setRibbonEditorMode: (mode: 'create' | 'edit' | 'preview') => void;

  // Commander search actions
  setCommanderSearchOpen: (open: boolean) => void;
  setCommanderSearchQuery: (query: string) => void;

  // Preferences panel actions
  setPreferencesPanelOpen: (open: boolean) => void;
  setPreferencesActiveTab: (tab: string) => void;

  // Utility actions
  resetUI: () => void;
}

// Combined state and actions type
export type UIStore = UIState & UIActions;

// Initial state
const initialState: UIState = {
  theme: 'auto',
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeModals: [],
  currentPage: '/',
  breadcrumbs: [],
  globalLoading: false,
  loadingStates: {},
  notifications: [],
  ribbonEditorOpen: false,
  ribbonEditorMode: 'create',
  commanderSearchOpen: false,
  commanderSearchQuery: '',
  preferencesPanelOpen: false,
  preferencesActiveTab: 'general',
};

// Create the UI store
export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Theme actions
        setTheme: (theme: 'light' | 'dark' | 'auto') => {
          set({ theme });
        },

        toggleTheme: () => {
          const { theme } = get();
          const newTheme =
            theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
          set({ theme: newTheme });
        },

        // Layout actions
        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open });
        },

        toggleSidebar: () => {
          const { sidebarOpen } = get();
          set({ sidebarOpen: !sidebarOpen });
        },

        setSidebarCollapsed: (collapsed: boolean) => {
          set({ sidebarCollapsed: collapsed });
        },

        toggleSidebarCollapsed: () => {
          const { sidebarCollapsed } = get();
          set({ sidebarCollapsed: !sidebarCollapsed });
        },

        // Modal actions
        openModal: (modalId: string) => {
          const { activeModals } = get();
          if (!activeModals.includes(modalId)) {
            set({ activeModals: [...activeModals, modalId] });
          }
        },

        closeModal: (modalId: string) => {
          const { activeModals } = get();
          set({ activeModals: activeModals.filter((id) => id !== modalId) });
        },

        closeAllModals: () => {
          set({ activeModals: [] });
        },

        // Navigation actions
        setCurrentPage: (page: string) => {
          set({ currentPage: page });
        },

        setBreadcrumbs: (
          breadcrumbs: Array<{ label: string; href: string }>
        ) => {
          set({ breadcrumbs });
        },

        addBreadcrumb: (breadcrumb: { label: string; href: string }) => {
          const { breadcrumbs } = get();
          set({ breadcrumbs: [...breadcrumbs, breadcrumb] });
        },

        clearBreadcrumbs: () => {
          set({ breadcrumbs: [] });
        },

        // Loading actions
        setGlobalLoading: (loading: boolean) => {
          set({ globalLoading: loading });
        },

        setLoadingState: (key: string, loading: boolean) => {
          const { loadingStates } = get();
          set({ loadingStates: { ...loadingStates, [key]: loading } });
        },

        clearLoadingState: (key: string) => {
          const { loadingStates } = get();
          const newLoadingStates = { ...loadingStates };
          delete newLoadingStates[key];
          set({ loadingStates: newLoadingStates });
        },

        clearAllLoadingStates: () => {
          set({ loadingStates: {} });
        },

        // Notification actions
        addNotification: (notification) => {
          const { notifications } = get();
          const id = Math.random().toString(36).substr(2, 9);
          const newNotification = { ...notification, id };

          set({ notifications: [...notifications, newNotification] });

          // Auto-remove notification after duration
          if (notification.duration !== undefined) {
            setTimeout(() => {
              get().removeNotification(id);
            }, notification.duration);
          }
        },

        removeNotification: (id: string) => {
          const { notifications } = get();
          set({ notifications: notifications.filter((n) => n.id !== id) });
        },

        clearNotifications: () => {
          set({ notifications: [] });
        },

        // Ribbon editor actions
        setRibbonEditorOpen: (open: boolean) => {
          set({ ribbonEditorOpen: open });
        },

        setRibbonEditorMode: (mode: 'create' | 'edit' | 'preview') => {
          set({ ribbonEditorMode: mode });
        },

        // Commander search actions
        setCommanderSearchOpen: (open: boolean) => {
          set({ commanderSearchOpen: open });
        },

        setCommanderSearchQuery: (query: string) => {
          set({ commanderSearchQuery: query });
        },

        // Preferences panel actions
        setPreferencesPanelOpen: (open: boolean) => {
          set({ preferencesPanelOpen: open });
        },

        setPreferencesActiveTab: (tab: string) => {
          set({ preferencesActiveTab: tab });
        },

        // Utility actions
        resetUI: () => {
          set({
            sidebarOpen: true,
            sidebarCollapsed: false,
            activeModals: [],
            globalLoading: false,
            loadingStates: {},
            notifications: [],
            ribbonEditorOpen: false,
            ribbonEditorMode: 'create',
            commanderSearchOpen: false,
            commanderSearchQuery: '',
            preferencesPanelOpen: false,
            preferencesActiveTab: 'general',
          });
        },
      }),
      {
        name: 'ed-ribbon-maker-ui',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
          sidebarCollapsed: state.sidebarCollapsed,
          preferencesActiveTab: state.preferencesActiveTab,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);
