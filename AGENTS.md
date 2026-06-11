## 🏗️ Project Structure

### Monorepo setup

- **Package Manager**: pnpm 10.4.1 with workspace
- **Build System**: Turbo
- **Applications**:
  - `apps/web` - Next.js 15 frontend
  - `apps/api` - NestJS backend API
  - `apps/worker` - Worker service with Temporal
  - `apps/workflow` - Workflow engine service
- **Shared Packages**:
  - `packages/ui` - Shared UI components
  - `packages/eslint-config` - Shared ESLint config
  - `packages/typescript-config` - Shared TypeScript config
  - `packages/be` - Backend shared utilities for backend
  - `packages/bpmn` - BPMN workflow utilities
  - `packages/common` - Common utilities for backend
  - `packages/i18n` - Internationalization utilities for backend
  - `packages/models` - Data models for backend
  - `packages/utils` - General utilities for backend

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript 5.8
- **Backend**: NestJS with TypeORM
- **UI**: Tailwind CSS 4.0, @workspace/ui components
- **State Management**: TanStack Query, React Hook Form, Zustand
- **Auth**: NextAuth 5.0 beta with TypeORM adapter
- **Database**: Postgres DB with TypeORM for production
- **Workflow**: Temporal workflow engine with BPMN
- **i18n**: next-intl (Vietnamese/English)
- **Theme**: next-themes (dark/light mode)
- **Caching**: Redis with ioredis
