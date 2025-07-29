# ED Ribbon Maker - Project Outline

## Project Overview

A Cloudflare-hosted web application that allows Elite Dangerous pilots to generate virtual "ribbon racks" of their in-game achievements by synchronizing data from Inara.cz. The app renders scalable SVG ribbons following a 32×8.22mm format for various career paths and navy ranks.

## Architecture Overview

### Frontend Stack

- **Framework**: React 18 + TypeScript
- **Build System**: Next.js with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (server state) + Zustand (client state)
- **Form Handling**: React Hook Form + Zod validation
- **Components**: SVG-based ribbon components with Framer Motion animations
- **Deployment**: Cloudflare Pages

### Backend/Edge Stack

- **Runtime**: Cloudflare Workers with Hono framework
- **API Integration**: Inara.cz API (https://inara.cz/inapi/v1/)
- **Authentication**: JWT session cookies with Jose library
- **Scheduling**: Cloudflare Workers Cron for periodic data syncs
- **Validation**: Zod schemas for request/response validation

### Data Storage Strategy

- **Primary Database**: Cloudflare D1 (SQLite) with Drizzle ORM
  - User records
  - Hashed API keys
  - User preferences
- **Cache Layer**: Cloudflare KV
  - Recent API responses
  - Signed session tokens
- **Object Storage**: Cloudflare R2
  - Generated ribbon images
  - Future user uploads
- **State Management**: Durable Objects
  - Per-user sync state
  - Rate limit counters

## Core Features

### 1. User Authentication & Account Management

- User registration/login system with NextAuth.js or Clerk
- Secure storage of Inara API keys (hashed with bcryptjs)
- Session management with JWT cookies
- Password reset and email verification

### 2. Data Synchronization

- Inara API integration for commander profile data
- Data normalization and caching with TanStack Query
- Periodic background syncs via Cron triggers
- Rate limiting and error handling

### 3. Ribbon Generation System

- SVG-based ribbon components for:
  - Combat achievements
  - Explorer achievements
  - Trader achievements
  - Exobiologist achievements
  - Mercenary achievements
  - Federal Navy ranks (2 alternative designs)
  - Imperial Navy ranks (2 alternative designs)
- 32×8.22mm format compliance
- On-the-fly generation with PNG pre-rendering using Sharp
- Interactive ribbon editing with Fabric.js or Konva.js

### 4. API Endpoints

- RESTful endpoints for React frontend
- Commander profile data retrieval
- Ribbon generation requests
- User preference management
- Type-safe API layer with tRPC (optional)

## Development Tools & Standards

### Code Quality & Standards

- **ESLint + Prettier**: Code formatting and linting
  - `@typescript-eslint/eslint-plugin` for strict TypeScript rules
  - `eslint-plugin-react-hooks` for React best practices
  - `eslint-plugin-jsx-a11y` for accessibility
  - `prettier-plugin-tailwindcss` for automatic class sorting

### Type Safety & Validation

- **Zod**: Runtime type validation for API requests/responses
- **React Hook Form + Zod**: Type-safe form handling
- **tRPC**: Type-safe API layer between frontend and backend (optional)

### Testing Strategy

- **Vitest**: Fast unit testing (works great with Cloudflare Workers)
- **MSW (Mock Service Worker)**: Mock Inara API for development
- **Playwright**: End-to-end testing with visual regression testing
- **Testing Library**: Component testing utilities

### Performance & Optimization

- **Next.js Image Optimization**: Built-in image optimization
- **React.memo & useMemo**: Optimize ribbon rendering
- **React.lazy**: Code splitting for ribbon components
- **Cloudflare Workers Cache API**: HTTP caching
- **Streaming Responses**: For large ribbon generation

## Security & Compliance

### Authentication & Authorization

- Cloudflare Access integration
- Salted hash storage for API keys
- HTTPS-only communication
- JWT-based session management
- Rate limiting and DDoS protection

### Data Protection

- Never store raw API keys
- Encrypted data transmission
- Secure session handling
- Input sanitization with Zod validation
- Security headers with Helmet.js

## Deployment & Infrastructure

### CI/CD Pipeline

- GitHub-based source control
- Cloudflare Pages automatic deployment
- Built-in GitHub Actions for "pages-deploy"
- Custom domain with automatic TLS
- Environment-specific deployments

### Monitoring & Observability

- Sentry integration for error tracking and performance monitoring
- Cloudflare Workers trace for latency monitoring
- Cloudflare Analytics and Web Vitals dashboards
- Logflare for better logging
- Optional logpush to R2/BigQuery/S3

### Development Workflow

- **Wrangler**: Local development with `wrangler dev --local`
- **Docker**: Consistent development environment
- **Concurrently**: Run multiple dev servers simultaneously
- **Plop.js**: Scaffold new components/endpoints

## Future Extensibility

### Planned Integrations

- Frontier OAuth verification
- CQC integration (additional rank table)
- Enhanced achievement tracking
- Mobile app possibilities
- Social features

### Scalability Considerations

- Edge computing for global performance
- CDN delivery for generated images
- Rate limiting and caching strategies
- WebAssembly for complex image processing

## Technical Specifications

### API Endpoints (Planned)

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/sync/inara` - Inara data synchronization
- `GET /api/commander/profile` - Commander profile data
- `GET /api/ribbons/generate` - Ribbon generation
- `PUT /api/user/preferences` - User preferences update

### Database Schema (D1 with Drizzle ORM)

```typescript
import { sqliteTable, text, integer, datetime } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: datetime('created_at').defaultNow(),
});

export const commanderProfiles = sqliteTable('commander_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  inaraCommanderId: text('inara_commander_id').notNull(),
  apiKeyHash: text('api_key_hash').notNull(),
  lastSync: datetime('last_sync'),
  profileData: text('profile_data'), // JSON
});

export const userPreferences = sqliteTable('user_preferences', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id),
  ribbonLayout: text('ribbon_layout'), // JSON
  displayOptions: text('display_options'), // JSON
});
```

### Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── ribbons/      # Ribbon components
│   └── layout/       # Layout components
├── lib/
│   ├── api/          # API utilities
│   ├── auth/         # Authentication
│   ├── db/           # Database utilities (Drizzle)
│   └── utils/        # Utility functions
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── styles/           # Global styles
├── test/             # Test setup and utilities
└── app/              # Next.js app directory
    ├── api/          # API routes
    └── functions/    # Cloudflare Functions
```

### Environment Variables

- `INARA_API_BASE_URL` - Inara API endpoint
- `JWT_SECRET` - JWT signing secret
- `DATABASE_URL` - D1 database binding
- `KV_NAMESPACE` - KV namespace binding
- `R2_BUCKET` - R2 bucket binding
- `SENTRY_DSN` - Sentry error tracking
- `NEXT_PUBLIC_API_URL` - Frontend API URL

### Package.json Scripts

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
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "wrangler:dev": "wrangler dev",
    "wrangler:deploy": "wrangler deploy"
  }
}
```

### Development Environment

- **VS Code Extensions**: Tailwind CSS IntelliSense, ESLint, Prettier, GitLens, Thunder Client
- **VS Code Settings**: Format on save, TypeScript preferences, Tailwind class regex
- **Recommended Tools**: Docker, Wrangler CLI, Cloudflare Dashboard
