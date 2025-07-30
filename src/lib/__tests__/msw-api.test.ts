import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

describe('MSW API Mocking', () => {
  describe('Authentication API', () => {
    it('should handle successful login', async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user).toBeDefined();
      expect(data.token).toBeDefined();
    });

    it('should handle failed login', async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid credentials');
    });

    it('should handle registration', async () => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'newuser',
          email: 'new@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user.email).toBe('new@example.com');
      expect(data.user.name).toBe('newuser');
    });
  });

  describe('Commander Profile API', () => {
    it('should fetch commander profile', async () => {
      const response = await fetch('/api/commander/profile');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.commander).toBeDefined();
      expect(data.commander.name).toBe('Commander Test');
      expect(data.commander.rankCombat).toBe(5);
    });

    it('should update commander profile', async () => {
      const updateData = {
        name: 'Updated Commander',
        rankCombat: 8,
      };

      const response = await fetch('/api/commander/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.commander.name).toBe('Updated Commander');
      expect(data.commander.rankCombat).toBe(8);
    });
  });

  describe('Inara API Sync', () => {
    it('should sync with Inara API', async () => {
      const response = await fetch('/api/sync/inara', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: 'test-api-key',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.commander).toBeDefined();
      expect(data.data.lastSync).toBeDefined();
    });

    it('should require API key', async () => {
      const response = await fetch('/api/sync/inara', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('API key is required');
    });
  });

  describe('User Preferences API', () => {
    it('should fetch user preferences', async () => {
      const response = await fetch('/api/user/preferences');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.preferences).toBeDefined();
      expect(data.preferences.theme).toBe('dark');
      expect(data.preferences.notifications).toBe(true);
    });

    it('should update user preferences', async () => {
      const newPreferences = {
        theme: 'light',
        notifications: false,
        autoSync: true,
        ribbonLayout: 'vertical',
      };

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.preferences).toEqual(newPreferences);
    });
  });

  describe('Ribbon API', () => {
    it('should fetch ribbons', async () => {
      const response = await fetch('/api/ribbons');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.ribbons).toBeInstanceOf(Array);
      expect(data.ribbons.length).toBeGreaterThan(0);
    });

    it('should generate ribbon', async () => {
      const ribbonData = {
        type: 'combat',
        level: 5,
        color: '#FF0000',
        backgroundColor: '#000000',
      };

      const response = await fetch('/api/ribbons/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ribbonData),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.ribbon).toBeDefined();
      expect(data.ribbon.type).toBe('combat');
      expect(data.ribbon.level).toBe(5);
      expect(data.ribbon.imageUrl).toBeDefined();
    });
  });

  describe('Inara External API', () => {
    it('should mock Inara API getcommanderprofile', async () => {
      const response = await fetch('https://inara.cz/inapi/v1/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: 'getcommanderprofile',
          eventData: {
            searchName: 'Commander Test',
          },
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.header.eventStatus).toBe(200);
      expect(data.header.eventData.commanderName).toBe('Commander Test');
      expect(data.header.eventData.commanderRanksPilot).toBeInstanceOf(Array);
    });
  });

  describe('Dynamic Handler Override', () => {
    it('should allow overriding handlers in tests', async () => {
      // Override the handler for this specific test
      server.use(
        http.get('/api/commander/profile', () => {
          return HttpResponse.json({
            success: true,
            commander: {
              id: 'override-test',
              name: 'Override Commander',
              rankCombat: 10,
            },
          });
        })
      );

      const response = await fetch('/api/commander/profile');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.commander.id).toBe('override-test');
      expect(data.commander.name).toBe('Override Commander');
      expect(data.commander.rankCombat).toBe(10);
    });
  });
});
