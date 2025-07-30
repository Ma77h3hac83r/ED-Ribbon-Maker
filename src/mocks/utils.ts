import { http, HttpResponse } from 'msw';

// Common response patterns
export const createSuccessResponse = (data: any) => {
  return HttpResponse.json({
    success: true,
    ...data,
  });
};

export const createErrorResponse = (message: string, status = 400) => {
  return HttpResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
};

// Common mock data
export const mockCommander = {
  id: '1',
  name: 'Commander Test',
  email: 'test@example.com',
  inaraId: '12345',
  rankCombat: 5,
  rankTrade: 3,
  rankExplorer: 7,
  rankExobiologist: 2,
  rankMercenary: 4,
  rankFederal: 8,
  rankImperial: 6,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockPreferences = {
  theme: 'dark' as const,
  notifications: true,
  autoSync: true,
  ribbonLayout: 'horizontal' as const,
};

export const mockRibbons = [
  {
    id: 'ribbon-1',
    type: 'combat' as const,
    level: 5,
    name: 'Combat Elite',
    description: 'Elite combat rank',
    color: '#FF0000',
    backgroundColor: '#000000',
  },
  {
    id: 'ribbon-2',
    type: 'explorer' as const,
    level: 3,
    name: 'Explorer Ranger',
    description: 'Ranger explorer rank',
    color: '#00FF00',
    backgroundColor: '#000000',
  },
];

// Common handlers
export const createAuthHandlers = () => [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();

    if (body.email === 'test@example.com' && body.password === 'password123') {
      return createSuccessResponse({
        user: mockCommander,
        token: 'mock-jwt-token',
      });
    }

    return createErrorResponse('Invalid credentials', 401);
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json();

    if (body.password !== body.confirmPassword) {
      return createErrorResponse('Passwords do not match');
    }

    return createSuccessResponse({
      user: {
        ...mockCommander,
        id: 'new-user-id',
        email: body.email,
        name: body.username,
      },
      token: 'mock-jwt-token',
    });
  }),
];

export const createCommanderHandlers = () => [
  http.get('/api/commander/profile', () => {
    return createSuccessResponse({ commander: mockCommander });
  }),

  http.put('/api/commander/profile', async ({ request }) => {
    const body = await request.json();
    return createSuccessResponse({
      commander: { ...mockCommander, ...body },
    });
  }),
];

export const createPreferencesHandlers = () => [
  http.get('/api/user/preferences', () => {
    return createSuccessResponse({ preferences: mockPreferences });
  }),

  http.put('/api/user/preferences', async ({ request }) => {
    const body = await request.json();
    return createSuccessResponse({ preferences: body });
  }),
];

export const createRibbonHandlers = () => [
  http.get('/api/ribbons', () => {
    return createSuccessResponse({ ribbons: mockRibbons });
  }),

  http.post('/api/ribbons/generate', async ({ request }) => {
    const body = await request.json();
    return createSuccessResponse({
      ribbon: {
        id: 'generated-ribbon',
        type: body.type,
        level: body.level,
        name: `${body.type} ${body.level}`,
        description: `Generated ${body.type} ribbon`,
        color: body.color || '#FF0000',
        backgroundColor: body.backgroundColor || '#000000',
        imageUrl: '/api/ribbons/generated-ribbon.png',
      },
    });
  }),
];

export const createInaraHandlers = () => [
  http.post('/api/sync/inara', async ({ request }) => {
    const body = await request.json();

    if (!body.apiKey) {
      return createErrorResponse('API key is required');
    }

    return createSuccessResponse({
      data: {
        commander: {
          name: 'Commander Test',
          inaraId: '12345',
          ranks: {
            combat: 5,
            trade: 3,
            explorer: 7,
            exobiologist: 2,
            mercenary: 4,
            federal: 8,
            imperial: 6,
          },
        },
        lastSync: new Date().toISOString(),
      },
    });
  }),

  http.post('https://inara.cz/inapi/v1/', async ({ request }) => {
    const body = await request.json();

    switch (body.eventName) {
      case 'getcommanderprofile':
        return HttpResponse.json({
          header: {
            eventStatus: 200,
            eventData: {
              commanderName: 'Commander Test',
              commanderRanksPilot: [
                { rankName: 'Combat', rankValue: 5 },
                { rankName: 'Trade', rankValue: 3 },
                { rankName: 'Explorer', rankValue: 7 },
                { rankName: 'Exobiologist', rankValue: 2 },
                { rankName: 'Mercenary', rankValue: 4 },
                { rankName: 'Federal Navy', rankValue: 8 },
                { rankName: 'Imperial Navy', rankValue: 6 },
              ],
            },
          },
        });

      default:
        return HttpResponse.json({
          header: {
            eventStatus: 400,
            eventStatusText: 'Unknown event',
          },
        });
    }
  }),
];
