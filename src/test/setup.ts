import '@testing-library/jest-dom';

// Mock environment variables for testing
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8787';
process.env.NEXT_PUBLIC_INARA_API_URL = 'https://inara.cz/inapi/v1/';

// Mock fetch for API testing
global.fetch = jest.fn();

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));