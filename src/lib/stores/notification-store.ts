import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Notification interface
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // in milliseconds, undefined = persistent
  createdAt: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible: boolean;
}

// Notification state interface
export interface NotificationState {
  // Active notifications
  notifications: Notification[];

  // Settings
  settings: {
    maxNotifications: number;
    defaultDuration: number; // in milliseconds
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    enableSound: boolean;
    enableAnimations: boolean;
  };

  // Statistics
  stats: {
    totalNotifications: number;
    unreadCount: number;
    dismissedCount: number;
  };
}

// Notification actions interface
export interface NotificationActions {
  // Notification management
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
  ) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  clearNotificationsByType: (type: Notification['type']) => void;

  // Notification state
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  markAsUnread: (id: string) => void;

  // Settings
  updateSettings: (settings: Partial<NotificationState['settings']>) => void;

  // Utility actions
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: Notification['type']) => Notification[];
  dismissNotification: (id: string) => void;
  dismissAllNotifications: () => void;

  // Quick notification methods
  success: (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => string;
  error: (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => string;
  warning: (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => string;
  info: (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => string;
}

// Combined state and actions type
export type NotificationStore = NotificationState & NotificationActions;

// Initial state
const initialState: NotificationState = {
  notifications: [],
  settings: {
    maxNotifications: 10,
    defaultDuration: 5000, // 5 seconds
    position: 'top-right',
    enableSound: true,
    enableAnimations: true,
  },
  stats: {
    totalNotifications: 0,
    unreadCount: 0,
    dismissedCount: 0,
  },
};

// Create the notification store
export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Notification management
      addNotification: (notification) => {
        const { notifications, settings, stats } = get();
        const id = Math.random().toString(36).substr(2, 9);

        const newNotification: Notification = {
          ...notification,
          id,
          createdAt: new Date(),
          read: false,
          duration: notification.duration ?? settings.defaultDuration,
        };

        // Remove oldest notification if we exceed max
        let updatedNotifications = [...notifications, newNotification];
        if (updatedNotifications.length > settings.maxNotifications) {
          updatedNotifications = updatedNotifications.slice(
            -settings.maxNotifications
          );
        }

        // Auto-remove notification after duration
        if (newNotification.duration !== undefined) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }

        set({
          notifications: updatedNotifications,
          stats: {
            ...stats,
            totalNotifications: stats.totalNotifications + 1,
            unreadCount: stats.unreadCount + 1,
          },
        });

        return id;
      },

      removeNotification: (id: string) => {
        const { notifications, stats } = get();
        const notification = notifications.find((n) => n.id === id);

        set({
          notifications: notifications.filter((n) => n.id !== id),
          stats: {
            ...stats,
            unreadCount: notification?.read
              ? stats.unreadCount
              : stats.unreadCount - 1,
          },
        });
      },

      clearNotifications: () => {
        const { stats } = get();
        set({
          notifications: [],
          stats: {
            ...stats,
            unreadCount: 0,
          },
        });
      },

      clearNotificationsByType: (type: Notification['type']) => {
        const { notifications, stats } = get();
        const removedCount = notifications.filter(
          (n) => n.type === type && !n.read
        ).length;

        set({
          notifications: notifications.filter((n) => n.type !== type),
          stats: {
            ...stats,
            unreadCount: stats.unreadCount - removedCount,
          },
        });
      },

      // Notification state
      markAsRead: (id: string) => {
        const { notifications, stats } = get();
        const updatedNotifications = notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );

        set({
          notifications: updatedNotifications,
          stats: {
            ...stats,
            unreadCount: Math.max(0, stats.unreadCount - 1),
          },
        });
      },

      markAllAsRead: () => {
        const { notifications } = get();
        set({
          notifications: notifications.map((n) => ({ ...n, read: true })),
          stats: {
            ...get().stats,
            unreadCount: 0,
          },
        });
      },

      markAsUnread: (id: string) => {
        const { notifications, stats } = get();
        const updatedNotifications = notifications.map((n) =>
          n.id === id ? { ...n, read: false } : n
        );

        set({
          notifications: updatedNotifications,
          stats: {
            ...stats,
            unreadCount: stats.unreadCount + 1,
          },
        });
      },

      // Settings
      updateSettings: (settings: Partial<NotificationState['settings']>) => {
        const { settings: currentSettings } = get();
        set({ settings: { ...currentSettings, ...settings } });
      },

      // Utility actions
      getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter((n) => !n.read);
      },

      getNotificationsByType: (type: Notification['type']) => {
        const { notifications } = get();
        return notifications.filter((n) => n.type === type);
      },

      dismissNotification: (id: string) => {
        const { stats } = get();
        get().removeNotification(id);
        set({
          stats: {
            ...stats,
            dismissedCount: stats.dismissedCount + 1,
          },
        });
      },

      dismissAllNotifications: () => {
        const { notifications, stats } = get();
        set({
          notifications: [],
          stats: {
            ...stats,
            dismissedCount: stats.dismissedCount + notifications.length,
            unreadCount: 0,
          },
        });
      },

      // Quick notification methods
      success: (
        title: string,
        message?: string,
        options?: Partial<Notification>
      ) => {
        return get().addNotification({
          type: 'success',
          title,
          message: message || '',
          dismissible: true,
          ...options,
        });
      },

      error: (
        title: string,
        message?: string,
        options?: Partial<Notification>
      ) => {
        return get().addNotification({
          type: 'error',
          title,
          message: message || '',
          duration: undefined, // Errors are persistent by default
          dismissible: true,
          ...options,
        });
      },

      warning: (
        title: string,
        message?: string,
        options?: Partial<Notification>
      ) => {
        return get().addNotification({
          type: 'warning',
          title,
          message: message || '',
          dismissible: true,
          ...options,
        });
      },

      info: (
        title: string,
        message?: string,
        options?: Partial<Notification>
      ) => {
        return get().addNotification({
          type: 'info',
          title,
          message: message || '',
          dismissible: true,
          ...options,
        });
      },
    }),
    {
      name: 'notification-store',
    }
  )
);
