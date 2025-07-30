import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../stores/auth-store';
import { useUIStore } from '../stores/ui-store';
import { useRibbonStore } from '../stores/ribbon-store';
import { useCommanderStore } from '../stores/commander-store';
import { usePreferencesStore } from '../stores/preferences-store';
import { useNotificationStore } from '../stores/notification-store';

describe('Zustand Stores', () => {
  beforeEach(() => {
    // Clear all stores before each test
    useAuthStore.getState().logout();
    useUIStore.getState().resetUI();
    useRibbonStore.getState().resetRibbonState();
    useCommanderStore.getState().resetCommanderState();
    usePreferencesStore.getState().resetAllPreferences();
    useNotificationStore.getState().clearNotifications();
  });

  describe('Auth Store', () => {
    it('should have initial state', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.sessionToken).toBeNull();
      expect(state.error).toBeNull();
    });

    it('should set user', () => {
      const { setUser } = useAuthStore.getState();
      const mockUser = {
        id: '123',
        name: 'Test Commander',
        email: 'test@example.com',
        inaraId: '456',
        rankCombat: 5,
        rankTrade: 3,
        rankExplorer: 7,
        rankExobiologist: 2,
        rankMercenary: 4,
        rankFederal: 8,
        rankImperial: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should update user', () => {
      const { setUser, updateUser } = useAuthStore.getState();
      const mockUser = {
        id: '123',
        name: 'Test Commander',
        email: 'test@example.com',
        inaraId: '456',
        rankCombat: 5,
        rankTrade: 3,
        rankExplorer: 7,
        rankExobiologist: 2,
        rankMercenary: 4,
        rankFederal: 8,
        rankImperial: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      updateUser({ rankCombat: 8 });

      const state = useAuthStore.getState();
      expect(state.user?.rankCombat).toBe(8);
    });

    it('should handle logout', () => {
      const { setUser, logout } = useAuthStore.getState();
      const mockUser = {
        id: '123',
        name: 'Test Commander',
        email: 'test@example.com',
        inaraId: '456',
        rankCombat: 5,
        rankTrade: 3,
        rankExplorer: 7,
        rankExobiologist: 2,
        rankMercenary: 4,
        rankFederal: 8,
        rankImperial: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.sessionToken).toBeNull();
    });
  });

  describe('UI Store', () => {
    it('should have initial state', () => {
      const state = useUIStore.getState();

      expect(state.theme).toBe('auto');
      expect(state.sidebarOpen).toBe(true);
      expect(state.activeModals).toEqual([]);
      expect(state.notifications).toEqual([]);
    });

    it('should toggle theme', () => {
      const { toggleTheme } = useUIStore.getState();

      toggleTheme();
      expect(useUIStore.getState().theme).toBe('light');

      toggleTheme();
      expect(useUIStore.getState().theme).toBe('dark');

      toggleTheme();
      expect(useUIStore.getState().theme).toBe('auto');
    });

    it('should manage modals', () => {
      const { openModal, closeModal, closeAllModals } = useUIStore.getState();

      openModal('test-modal');
      expect(useUIStore.getState().activeModals).toContain('test-modal');

      openModal('another-modal');
      expect(useUIStore.getState().activeModals).toHaveLength(2);

      closeModal('test-modal');
      expect(useUIStore.getState().activeModals).not.toContain('test-modal');

      closeAllModals();
      expect(useUIStore.getState().activeModals).toEqual([]);
    });

    it('should manage notifications', () => {
      const { addNotification, removeNotification } = useUIStore.getState();

      addNotification({
        type: 'success',
        title: 'Test',
        message: 'Test message',
      });

      expect(useUIStore.getState().notifications).toHaveLength(1);
      expect(useUIStore.getState().notifications[0].title).toBe('Test');

      const notificationId = useUIStore.getState().notifications[0].id;
      removeNotification(notificationId);

      expect(useUIStore.getState().notifications).toHaveLength(0);
    });
  });

  describe('Ribbon Store', () => {
    it('should have initial state', () => {
      const state = useRibbonStore.getState();

      expect(state.currentRibbon).toBeNull();
      expect(state.selectedRibbons).toEqual([]);
      expect(state.ribbonDisplayMode).toBe('grid');
      expect(state.ribbonSortBy).toBe('name');
    });

    it('should manage selected ribbons', () => {
      const { addSelectedRibbon, removeSelectedRibbon, clearSelectedRibbons } =
        useRibbonStore.getState();
      const mockRibbon = {
        id: '123',
        type: 'combat' as const,
        level: 5,
        name: 'Combat Elite',
        description: 'Elite combat rank',
        color: '#FF0000',
        backgroundColor: '#000000',
      };

      addSelectedRibbon(mockRibbon);
      expect(useRibbonStore.getState().selectedRibbons).toHaveLength(1);

      removeSelectedRibbon('123');
      expect(useRibbonStore.getState().selectedRibbons).toHaveLength(0);

      addSelectedRibbon(mockRibbon);
      clearSelectedRibbons();
      expect(useRibbonStore.getState().selectedRibbons).toHaveLength(0);
    });

    it('should update ribbon layout', () => {
      const { updateRibbonLayout } = useRibbonStore.getState();

      updateRibbonLayout({ spacing: 20 });
      expect(useRibbonStore.getState().ribbonLayout.spacing).toBe(20);

      updateRibbonLayout({ showLabels: false });
      expect(useRibbonStore.getState().ribbonLayout.showLabels).toBe(false);
    });

    it('should manage ribbon filters', () => {
      const { setRibbonFilters, addRibbonFilterType, removeRibbonFilterType } =
        useRibbonStore.getState();

      setRibbonFilters({ searchQuery: 'test' });
      expect(useRibbonStore.getState().ribbonFilters.searchQuery).toBe('test');

      addRibbonFilterType('combat');
      expect(useRibbonStore.getState().ribbonFilters.types).toContain('combat');

      removeRibbonFilterType('combat');
      expect(useRibbonStore.getState().ribbonFilters.types).not.toContain(
        'combat'
      );
    });
  });

  describe('Commander Store', () => {
    it('should have initial state', () => {
      const state = useCommanderStore.getState();

      expect(state.currentCommander).toBeNull();
      expect(state.commanders).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.searchQuery).toBe('');
    });

    it('should manage commanders', () => {
      const { addCommander, updateCommander, removeCommander } =
        useCommanderStore.getState();
      const mockCommander = {
        id: '123',
        name: 'Test Commander',
        inaraId: '456',
        rankCombat: 5,
        rankTrade: 3,
        rankExplorer: 7,
        rankExobiologist: 2,
        rankMercenary: 4,
        rankFederal: 8,
        rankImperial: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addCommander(mockCommander);
      expect(useCommanderStore.getState().commanders).toHaveLength(1);

      updateCommander('123', { rankCombat: 8 });
      expect(useCommanderStore.getState().commanders[0].rankCombat).toBe(8);

      removeCommander('123');
      expect(useCommanderStore.getState().commanders).toHaveLength(0);
    });

    it('should manage favorites', () => {
      const {
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
      } = useCommanderStore.getState();

      addToFavorites('123');
      expect(useCommanderStore.getState().favoriteCommanders).toContain('123');
      expect(isFavorite('123')).toBe(true);

      removeFromFavorites('123');
      expect(useCommanderStore.getState().favoriteCommanders).not.toContain(
        '123'
      );
      expect(isFavorite('123')).toBe(false);

      toggleFavorite('456');
      expect(isFavorite('456')).toBe(true);

      toggleFavorite('456');
      expect(isFavorite('456')).toBe(false);
    });
  });

  describe('Preferences Store', () => {
    it('should have initial state', () => {
      const state = usePreferencesStore.getState();

      expect(state.preferences.ribbonLayout.arrangement).toBe('horizontal');
      expect(state.settings.language).toBe('en');
      expect(state.ribbonPreferences.defaultLayout).toBe('horizontal');
    });

    it('should update settings', () => {
      const { updateSetting } = usePreferencesStore.getState();

      updateSetting('language', 'es');
      expect(usePreferencesStore.getState().settings.language).toBe('es');

      updateSetting('timeFormat', '12h');
      expect(usePreferencesStore.getState().settings.timeFormat).toBe('12h');
    });

    it('should update ribbon preferences', () => {
      const { updateRibbonPreference } = usePreferencesStore.getState();

      updateRibbonPreference('defaultSpacing', 15);
      expect(
        usePreferencesStore.getState().ribbonPreferences.defaultSpacing
      ).toBe(15);

      updateRibbonPreference('defaultLayout', 'vertical');
      expect(
        usePreferencesStore.getState().ribbonPreferences.defaultLayout
      ).toBe('vertical');
    });

    it('should export and import preferences', () => {
      const { exportPreferences, importPreferences, updateSetting } =
        usePreferencesStore.getState();

      updateSetting('language', 'fr');
      const exported = exportPreferences();

      // Reset to default
      usePreferencesStore.getState().resetAllPreferences();
      expect(usePreferencesStore.getState().settings.language).toBe('en');

      // Import back
      const success = importPreferences(exported);
      expect(success).toBe(true);
      expect(usePreferencesStore.getState().settings.language).toBe('fr');
    });
  });

  describe('Notification Store', () => {
    it('should have initial state', () => {
      const state = useNotificationStore.getState();

      expect(state.notifications).toEqual([]);
      expect(state.settings.maxNotifications).toBe(10);
      expect(state.stats.totalNotifications).toBe(0);
    });

    it('should add notifications', () => {
      const { addNotification } = useNotificationStore.getState();

      const id = addNotification({
        type: 'success',
        title: 'Test',
        message: 'Test message',
      });

      expect(useNotificationStore.getState().notifications).toHaveLength(1);
      expect(useNotificationStore.getState().notifications[0].id).toBe(id);
      expect(useNotificationStore.getState().stats.totalNotifications).toBe(1);
    });

    it('should use quick notification methods', () => {
      const { success, error, warning, info } = useNotificationStore.getState();

      success('Success!');
      error('Error!');
      warning('Warning!');
      info('Info!');

      const notifications = useNotificationStore.getState().notifications;
      expect(notifications).toHaveLength(4);
      expect(notifications[0].type).toBe('success');
      expect(notifications[1].type).toBe('error');
      expect(notifications[2].type).toBe('warning');
      expect(notifications[3].type).toBe('info');
    });

    it('should manage notification state', () => {
      const { addNotification, markAsRead, markAllAsRead } =
        useNotificationStore.getState();

      addNotification({
        type: 'info',
        title: 'Test',
        message: 'Test message',
      });

      expect(useNotificationStore.getState().stats.unreadCount).toBe(1);

      const notificationId =
        useNotificationStore.getState().notifications[0].id;
      markAsRead(notificationId);

      expect(useNotificationStore.getState().stats.unreadCount).toBe(0);
      expect(useNotificationStore.getState().notifications[0].read).toBe(true);
    });
  });
});
