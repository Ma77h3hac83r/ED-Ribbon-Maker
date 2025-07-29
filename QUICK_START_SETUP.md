# Quick Start Setup Guide

## Initial Project Setup

### 1. Create Next.js Project with TypeScript

```bash
npx create-next-app@latest ed-ribbon-maker --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd ed-ribbon-maker
```

### 2. Install Essential Dependencies

```bash
# Core dependencies
npm install @tanstack/react-query zod react-hook-form @hookform/resolvers
npm install zustand framer-motion lucide-react
npm install @radix-ui/react-slot @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge

# Development dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint-config-prettier prettier prettier-plugin-tailwindcss
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
npm install -D msw @mswjs/data
```

### 3. Set up shadcn/ui

```bash
npx shadcn@latest init
# Choose: TypeScript, Tailwind CSS, src directory, CSS variables, React Server Components
```

Install essential components:
```bash
npx shadcn@latest add button card input label toast
npx shadcn@latest add form dialog dropdown-menu
npx shadcn@latest add avatar badge separator
```

### 4. Configure ESLint and Prettier

Create `.eslintrc.json`:
```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error"
  }
}
```

Create `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 5. Set up Vitest for Testing

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

### 6. Basic Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── ribbons/      # Ribbon components (to be created)
│   └── layout/       # Layout components
├── lib/
│   ├── api/          # API utilities
│   ├── auth/         # Authentication
│   ├── db/           # Database utilities
│   └── utils/        # Utility functions
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── styles/           # Global styles
└── app/              # Next.js app directory
```

### 7. Essential Utility Files

Create `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Create `src/lib/validations.ts`:
```typescript
import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const inaraApiKeySchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type InaraApiKeyInput = z.infer<typeof inaraApiKeySchema>;
```

### 8. Set up TanStack Query

Create `src/lib/providers.tsx`:
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

Update `src/app/layout.tsx`:
```typescript
import { Providers } from '@/lib/providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 9. Basic API Client Setup

Create `src/lib/api-client.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

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
};
```

### 10. Environment Variables

Create `.env.local`:
```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8787

# Cloudflare (to be added later)
# CLOUDFLARE_API_TOKEN=
# CLOUDFLARE_ACCOUNT_ID=
# DATABASE_URL=
# KV_NAMESPACE=
# R2_BUCKET=
# JWT_SECRET=
# INARA_API_BASE_URL=https://inara.cz/inapi/v1/
```

### 11. Update Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### 12. VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Next Steps

1. **Start the development server**: `npm run dev`
2. **Run tests**: `npm run test`
3. **Check types**: `npm run type-check`
4. **Format code**: `npm run format`

## Recommended VS Code Extensions

Install these extensions for the best development experience:
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client (for API testing)
- Error Lens
- Import Cost

This setup provides a solid foundation with:
- ✅ Type-safe development with TypeScript and Zod
- ✅ Modern React patterns with TanStack Query
- ✅ Beautiful UI components with shadcn/ui
- ✅ Comprehensive testing setup with Vitest
- ✅ Code quality tools with ESLint and Prettier
- ✅ Efficient development workflow

You can now start building your ribbon components and API endpoints on this solid foundation!