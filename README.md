# Elite Dangerous Ribbon Maker

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange?style=for-the-badge&logo=cloudflare)](https://workers.cloudflare.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.29-FF6B6B?style=for-the-badge)](https://orm.drizzle.team/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-0.0.1-000000?style=for-the-badge)](https://ui.shadcn.com/)

A modern web application for Elite Dangerous commanders to generate and display their virtual ribbon racks.

## 🚀 Features

- **Inara.cz Integration**: Sync commander data directly from Inara.cz API
- **SVG Ribbon Generation**: Create high-quality, scalable ribbon graphics
- **Customizable Layouts**: Arrange ribbons in horizontal, vertical, or grid layouts
- **PNG Export**: Convert SVG ribbons to PNG format for sharing
- **User Authentication**: Secure login with JWT session management
- **Cloudflare Edge**: Fast, global deployment with Workers and D1 database
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Complete API Mocking**: MSW infrastructure for development without backend dependencies
- **Comprehensive Testing**: 94.4% test coverage with Vitest and React Testing Library

## 🏗️ Project Architecture

### Frontend Stack

- **Next.js 14** with App Router for server-side rendering
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** with shadcn/ui components for modern UI
- **Zustand** for client-side state management
- **TanStack Query** for server state and caching
- **React Hook Form** with Zod validation
- **Framer Motion** for smooth animations
- **MSW** for API mocking and development workflow

### Backend & Infrastructure

- **Cloudflare Workers** for edge computing
- **Hono** web framework for API development
- **D1 Database** (SQLite) for data persistence
- **Cloudflare KV** for caching and session storage
- **Cloudflare R2** for image storage
- **Jose** for JWT authentication

### Development Tools

- **ESLint** & **Prettier** for code quality
- **Vitest** for unit testing with comprehensive setup
- **React Testing Library** for component testing
- **MSW** for complete API mocking infrastructure
- **Playwright** for end-to-end testing (planned)
- **Drizzle ORM** for database management

## 📋 Project Status

### ✅ Phase 1: Foundation (Complete)

- [x] Repository setup and development environment
- [x] Next.js project with TypeScript and App Router
- [x] Tailwind CSS and shadcn/ui components
- [x] ESLint, Prettier, and VS Code configuration
- [x] Cloudflare resources (D1, KV, R2)
- [x] Basic project structure and documentation
- [x] Comprehensive testing setup with Vitest and React Testing Library
- [x] Complete MSW API mocking infrastructure
- [x] 94.4% test coverage (101/107 tests passing)

### 🔄 Phase 2: Core Development (In Progress)

- [x] Enhanced development tools setup (MSW, testing infrastructure)
- [ ] Cloudflare infrastructure with Hono
- [ ] Database schema with Drizzle ORM
- [ ] Authentication system
- [ ] Inara.cz API integration
- [ ] Basic ribbon generation

### 📅 Upcoming Phases

- **Phase 3**: Advanced ribbon features and layouts
- **Phase 4**: User interface and experience
- **Phase 5**: Testing and quality assurance
- **Phase 6**: Performance optimization
- **Phase 7**: Deployment and monitoring
- **Phase 8**: Documentation and community features
- **Phase 9**: Advanced features and integrations

## 🤝 Contributing

This project is in active development. Contributions are welcome! Please read our contributing guidelines and development rules before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

**Built with ❤️ for the Elite Dangerous community**
