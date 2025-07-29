const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
const INARA_API_BASE_URL = process.env.NEXT_PUBLIC_INARA_API_URL || 'https://inara.cz/inapi/v1/';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json();
}

async function fetchInaraApi(endpoint: string, apiKey: string, options: RequestInit = {}) {
  const response = await fetch(`${INARA_API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json();
}

export const apiClient = {
  auth: {
    login: (data: { email: string; password: string }) =>
      fetchApi('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    register: (data: { username: string; email: string; password: string }) =>
      fetchApi('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  commander: {
    getProfile: (commanderId: string) =>
      fetchApi(`/api/commander/profile/${commanderId}`),
    syncInara: (apiKey: string) =>
      fetchApi('/api/sync/inara', {
        method: 'POST',
        body: JSON.stringify({ apiKey }),
      }),
  },
  ribbons: {
    generate: (data: { commanderId: string; layout: any }) =>
      fetchApi('/api/ribbons/generate', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  inara: {
    getCommanderProfile: (apiKey: string, commanderName: string) =>
      fetchInaraApi('getcommanderprofile', apiKey, {
        method: 'POST',
        body: JSON.stringify({ searchName: commanderName }),
      }),
  },
};