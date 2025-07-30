import { http, HttpResponse } from 'msw';
import {
  createAuthHandlers,
  createCommanderHandlers,
  createPreferencesHandlers,
  createRibbonHandlers,
  createInaraHandlers,
} from './utils';

// API Handlers
export const handlers = [
  // Combine all handler groups
  ...createAuthHandlers(),
  ...createCommanderHandlers(),
  ...createPreferencesHandlers(),
  ...createRibbonHandlers(),
  ...createInaraHandlers(),

  // Fallback handler for unmatched requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),
];
