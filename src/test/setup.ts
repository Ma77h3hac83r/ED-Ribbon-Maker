import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
import { server } from '@/mocks/server';

// Mock environment variables for testing
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8787';
process.env.NEXT_PUBLIC_INARA_API_URL = 'https://inara.cz/inapi/v1/';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Next.js image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(props: any) {
    return React.createElement('img', props);
  },
}));
