# Tài liệu Cấu trúc & Hướng dẫn Dự án — btp-csdlcc-monorepo

> **Dự án:** Cơ sở dữ liệu Công chứng (CSDLCC) — Bộ Tư pháp
> **Kiến trúc:** Monorepo (pnpm workspaces + Turborepo)

---

## Mục lục

- [Yêu cầu môi trường](#1-yêu-cầu-môi-trường)
- [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
- [Ứng dụng (apps)](#3-ứng-dụng-apps)
- [Packages dùng chung (packages)](#4-packages-dùng-chung-packages)
- [Cài đặt & khởi chạy](#5-cài-đặt--khởi-chạy)
- [Biến môi trường](#6-biến-môi-trường)
- [Quy trình phát triển](#7-quy-trình-phát-triển)
- [Quy ước commit & nhánh](#8-quy-ước-commit--nhánh)
- [Testing](#9-testing)
- [GraphQL Codegen](#10-graphql-codegen)
- [Build & Docker](#11-build--docker)
- [Công cụ & cấu hình](#12-công-cụ--cấu-hình)

---

## 1. Yêu cầu môi trường

| Công cụ | Phiên bản tối thiểu              |
| ------- | -------------------------------- |
| Node.js | `>= 20` (khuyến nghị `v20.19.4`) |
| pnpm    | `9.15.9`                         |
| Git     | Bất kỳ phiên bản hiện đại        |

---

## 2. Cấu trúc thư mục

```
btp-csdlcc-monorepo/
├── apps/                    # Các ứng dụng chính
│   ├── api/                 # Backend NestJS (mẫu / skeleton)
│   ├── api-prisma/          # Backend NestJS + Prisma ORM
│   ├── api-typeorm/         # Backend NestJS + TypeORM
│   ├── mobile/              # App di động (Expo / React Native)
│   ├── web/                 # Frontend Next.js (ứng dụng chính)
│   ├── web-test/            # Môi trường test / design system
│   └── worker/              # NestJS Worker (xử lý background jobs)
├── packages/                # Shared packages (dùng chung giữa apps)
│   ├── common/              # Logic backend dùng chung (NestJS, validators...)
│   ├── data-types/          # Định nghĩa kiểu dữ liệu chung
│   ├── eslint-config/       # Cấu hình ESLint chung
│   ├── i18n/                # Đa ngôn ngữ / bản dịch
│   ├── models-prisma/       # Models Prisma (entities database)
│   ├── models-typeorm/      # Models TypeORM (entities database)
│   ├── typescript-config/   # Cấu hình TypeScript chung
│   ├── ui/                  # Component library (React / shadcn-ui)
│   └── utils/               # Hàm tiện ích dùng chung
├── docker/                  # Dockerfile và hướng dẫn build image
├── docs/                    # Tài liệu dự án
├── turbo.json               # Cấu hình Turborepo build pipeline
├── pnpm-workspace.yaml      # Khai báo workspaces
├── package.json             # Root scripts & devDependencies
└── commitlint.config.js     # Quy tắc commit message
```

---

## 3. Ứng dụng (apps)

### `apps/web` — Frontend chính (Next.js 16)

**Công nghệ:** Next.js 16, React 19, TypeScript, Tailwind CSS, Apollo Client, TanStack Query, Zustand, next-auth, next-intl, Keycloak

**Các module chức năng** (route groups trong `app/`):

| Route      | Chức năng                                     |
| ---------- | --------------------------------------------- |
| `(admin)/` | Màn hình dành cho khách (Cần đăng nhập)       |
| `(guest)/` | Màn hình dành cho khách (không cần đăng nhập) |

**Cấu trúc thư mục web:**

```
apps/web/
├── app/                  # Next.js App Router
│   ├── (admin)/          # Layout admin (yêu cầu xác thực)
│   ├── (guest)/          # Layout guest (public)
│   ├── auth.ts           # NextAuth config
│   └── keycloak.ts       # Keycloak integration
├── components/           # Components dùng riêng cho web
├── graphql/              # GraphQL queries & mutations (.graphql)
├── graphql-schema/       # GraphQL SDL schema files
├── hooks/                # Custom React hooks
├── lib/                  # Thư viện / helpers
├── services/             # API service calls
├── stores/               # Zustand stores
├── types/                # Định nghĩa kiểu TypeScript
├── e2e/                  # End-to-end tests (Playwright + BDD)
├── env.ts                # Khai báo và validate biến môi trường
├── codegen.ts            # Cấu hình GraphQL code generation
└── next.config.mjs       # Next.js config (standalone output)
```

---

### `apps/api` — Backend NestJS (skeleton)

**Công nghệ:** NestJS 11, TypeScript
Đây là app NestJS mẫu/skeleton. Dự án chính sử dụng `api-typeorm` hoặc `api-prisma`.

---

### `apps/api-typeorm` — Backend chính (NestJS + TypeORM)

**Công nghệ:** NestJS 11, TypeORM, TypeScript

---

### `apps/api-prisma` — Backend (NestJS + Prisma)

**Công nghệ:** NestJS 11, Prisma ORM, TypeScript

---

### `apps/worker` — Background Worker (NestJS)

Xử lý các tác vụ nền, jobs, queue.

---

### `apps/mobile` — App di động (Expo)

**Công nghệ:** Expo, React Native, TypeScript

**Khởi chạy:**

```sh
cd apps/mobile
pnpm ios      # Chạy trên iOS Simulator
pnpm android  # Chạy trên Android Emulator
pnpm start    # Expo DevServer
```

---

### `apps/web-test` — Design System / Test

Môi trường thử nghiệm và thiết kế giao diện.

**Design System (PanAuto):**

- Canvas: `#0F172A`, Surface: `#1E293B`, CTA: `#22C55E`, Text: `#F8FAFC`
- Font: JetBrains Mono (heading), IBM Plex Sans (body)
- Icons: Lucide SVG

---

## 4. Packages dùng chung (packages)

| Package             | Tên npm                        | Mô tả                                                                                                                     |
| ------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `common`            | `@ac/common`                   | Logic NestJS chung: validators, interceptors, decorators. Phụ thuộc: `@ac/i18n`, `@ac/utils`, TypeORM, ioredis, lodash... |
| `data-types`        | `@ac/data-types`               | Kiểu dữ liệu & interface dùng chung                                                                                       |
| `eslint-config`     | `@workspace/eslint-config`     | Cấu hình ESLint tập trung                                                                                                 |
| `i18n`              | `@ac/i18n`                     | Hỗ trợ đa ngôn ngữ (nestjs-i18n)                                                                                          |
| `models-prisma`     | `@ac/models-prisma`            | Entities/Models Prisma ORM                                                                                                |
| `models-typeorm`    | `@ac/models-typeorm`           | Entities/Models TypeORM                                                                                                   |
| `typescript-config` | `@workspace/typescript-config` | Các cấu hình tsconfig cơ sở                                                                                               |
| `ui`                | `@workspace/ui`                | React component library (shadcn-ui, Tailwind)                                                                             |
| `utils`             | `@ac/utils`                    | Hàm tiện ích (pure functions)                                                                                             |

**Cách import trong app:**

```ts
// Trong web app
import { Button } from "@workspace/ui";

// Trong api-typeorm
import { SomeHelper } from "@ac/common";
import { UserEntity } from "@ac/models-typeorm";
```

---

## 5. Cài đặt & khởi chạy

### Cài đặt dependencies

```sh
pnpm install
```

### Khởi chạy toàn bộ (từ root)

```sh
pnpm dev           # Chạy web app (mặc định)
pnpm start:web     # Chạy web app Next.js
pnpm start:api     # Chạy API NestJS
```

### Khởi chạy từng app riêng lẻ

```sh
# Web
cd apps/web
pnpm dev           # Next.js với Turbopack

# API TypeORM
cd apps/api-typeorm
pnpm dev

# Worker
cd apps/worker
pnpm dev

# Mobile
cd apps/mobile
pnpm start
```

### Chạy web-test (design system)

```sh
pnpm pan           # Shortcut từ root
# hoặc
cd apps/web-test
pnpm dev
```

---

## 6. Biến môi trường

### Web (`apps/web/.env.local`)

Tất cả biến môi trường web được khai báo trong `apps/web/env.ts`:

```env
# GraphQL Endpoints
NEXT_PUBLIC_GRAPHQL_...=

# REST API Endpoints
NEXT_PUBLIC_API_...=
```

### E2E Testing (`apps/web/.env.e2e.local`)

Tạo từ file mẫu:

```sh
cp apps/web/.env.e2e.example apps/web/.env.e2e.local
```

```env
E2E_BASE_URL=http://localhost:3000   # URL base cho test
```

---

## 7. Quy trình phát triển

### Tạo tính năng mới

1. Lấy số Issue từ tracker (Jira / GitHub)
2. Tạo nhánh theo format chuẩn (xem phần [Quy ước nhánh](#nhánh-git)):
   ```sh
   git checkout origin/develop
   git checkout -b feat/#123-ten-tinh-nang
   ```
3. Phát triển và commit theo [Conventional Commits](#commit-message)
4. Tạo Pull Request merge vào `develop`

### Deploy lên môi trường test

Merge vào nhánh `build` để kích hoạt CI/CD deploy tự động.

### Thêm / thay đổi npm package

Sau khi cập nhật `package.json`, chạy lại build cache image để tăng tốc CI:

```sh
pnpm install
# Rebuild Docker cache layer sau đó
```

---

## 8. Quy ước commit & nhánh

### Nhánh Git

**Format:** `<type>/#<issue-number>-mo-ta-ngan`

| Type       | Ý nghĩa                                 |
| ---------- | --------------------------------------- |
| `feat`     | Tính năng mới                           |
| `fix`      | Sửa lỗi                                 |
| `hot-fix`  | Sửa lỗi khẩn cấp cần release ngay       |
| `chore`    | Bảo trì (dependencies, config, tooling) |
| `docs`     | Chỉ thay đổi tài liệu                   |
| `refactor` | Tái cấu trúc code (không đổi hành vi)   |
| `style`    | Format, khoảng trắng, dấu chấm phẩy     |
| `test`     | Thêm hoặc cập nhật tests                |
| `release`  | Release phiên bản                       |

**Ví dụ:**

```sh
feat/#123-them-chuc-nang-tra-cuu
fix/#456-sua-loi-dang-nhap
hot-fix/#789-loi-nghiem-trong-production
```

> **Lưu ý:** Husky pre-commit hook sẽ từ chối commit nếu tên nhánh không đúng format.

### Commit message

Tuân theo **Conventional Commits**. Husky tự động thêm `#<issue-number>` vào đầu commit message.

**Format:** `<type>: <mô tả>`

```sh
feat: thêm màn hình tra cứu văn bản công chứng
fix: sửa lỗi phân trang bảng giao dịch
docs: cập nhật README hướng dẫn cài đặt
```

**Các type hợp lệ:** `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

---

## 9. Testing

### E2E Tests (Playwright + BDD)

**Cấu trúc test:**

```
apps/web/e2e/
├── features/
│   ├── setup/        # Test setup (đăng nhập, chuẩn bị dữ liệu)
│   ├── isolated/     # Test độc lập (mock data)
│   ├── shared/       # Test dùng chung (shared state)
│   └── mock/         # Test với mock server
├── steps/            # Step definitions (BDD Gherkin steps)
└── support/          # Helper, fixtures, bdd config
```

**Chạy tests từ root:**

```sh
# Chạy E2E test cơ bản
pnpm test:e2e:web

# Chạy BDD tests (tất cả)
pnpm test:e2e:web:bdd

# Chạy BDD shared tests
pnpm test:e2e:web:bdd:shared

# Chạy với browser hiển thị (headed)
pnpm test:e2e:web:bdd:shared:headed

# Debug mode
pnpm test:e2e:web:bdd:shared:debug

# UI mode (Playwright UI)
pnpm test:e2e:web:bdd:shared:ui

# Xem report sau khi test
pnpm test:e2e:web:report
```

**Chạy từ thư mục web:**

```sh
cd apps/web
pnpm test:e2e:bdd:shared
pnpm test:e2e:ui          # Playwright UI mode
```

**Playwright Projects:**

| Project        | Mô tả                                          |
| -------------- | ---------------------------------------------- |
| `bdd-isolated` | BDD tests độc lập, không chia sẻ state         |
| `bdd-shared`   | BDD tests dùng chung state (đăng nhập một lần) |
| `bdd-mock`     | BDD tests với mock server                      |
| `bdd-panauto`  | Tests được PanAuto tự động generate            |

---

## 10. GraphQL Codegen

Dự án sử dụng **GraphQL Code Generator** để tự động tạo TypeScript types từ schema GraphQL.

### Schema files (SDL)

```
apps/web/graphql-schema/
├── user-profile.schema.graphql     # Schema user & profile
├── notary.schema.graphql           # Schema công chứng
├── master-data.schema.graphql      # Schema danh mục
└── authorization.schema.graphql    # Schema phân quyền
```

### Khi nào cần chạy codegen

Chạy lại sau khi:

- Thêm / sửa file `.graphql` trong `apps/web/graphql/`
- Cập nhật file schema trong `apps/web/graphql-schema/`

```sh
cd apps/web
pnpm codegen
```

Cấu hình chi tiết xem tại: `apps/web/codegen.ts`

---

## 11. Build & Docker

### Build toàn bộ monorepo

```sh
pnpm build             # Build tất cả (Turborepo)
pnpm build:web         # Chỉ build web
pnpm build:api         # Chỉ build API
```

### Docker Images

| Image            | Dockerfile                         | Registry                                                     |
| ---------------- | ---------------------------------- | ------------------------------------------------------------ |
| Web (production) | `apps/web/DockerfileStaging`       | `registry-int.moj.gov.vn/fpt-csdlcc/btp-cc-web`              |
| Web (FIS cache)  | `docker/DockerfileWebCacheStaging` | `default-route-openshift-image-registry.../btp-cc-web-cache` |
| HSM              | `docker/Dockerfile`                | `registry-int.moj.gov.vn/fpt-csdlcc/btp-hsm`                 |

**Build & Push web:**

```sh
# Build web image
docker build --platform=linux/amd64 --progress=plain \
  -t registry-int.moj.gov.vn/fpt-csdlcc/btp-cc-web \
  -f ./apps/web/DockerfileStaging .

docker push registry-int.moj.gov.vn/fpt-csdlcc/btp-cc-web
```

Chi tiết đầy đủ xem: `docker/BUILD_DOCKER.md`

### Next.js Output Mode

Web app được cấu hình `output: 'standalone'` — tạo ra thư mục `.next/standalone` tối ưu cho Docker.

---

## 12. Công cụ & cấu hình

### Turborepo (`turbo.json`)

Build pipeline được quản lý bởi Turborepo:

| Task        | Phụ thuộc                                | Ghi chú                   |
| ----------- | ---------------------------------------- | ------------------------- |
| `build`     | Dependencies phải build trước (`^build`) | Output: `.next/**`        |
| `dev`       | Không cache                              | Persistent (long-running) |
| `lint`      | `^lint`                                  |                           |
| `typecheck` | `^typecheck`                             |                           |
| `format`    | `^format`                                |                           |

### Code Quality

| Công cụ     | Mục đích                             | Lệnh               |
| ----------- | ------------------------------------ | ------------------ |
| ESLint      | Lint code                            | `pnpm lint`        |
| Prettier    | Format code                          | `pnpm format`      |
| TypeScript  | Type check                           | `pnpm typecheck`   |
| Husky       | Git hooks (pre-commit, commit-msg)   | Tự động            |
| lint-staged | Chỉ lint file đã staged              | Tự động khi commit |
| commitlint  | Validate commit message              | Tự động khi commit |
| knip        | Phát hiện code chết / unused exports | `knip`             |

### Prettier

Format tự động cho: `*.{ts,tsx,md,js,mjs,jsx,json,css,scss}`
Plugins: `prettier-plugin-tailwindcss`, `prettier-plugin-sort-json`, `@trivago/prettier-plugin-sort-imports`

### TypeScript

Cấu hình gốc tập trung tại `packages/typescript-config/`. Mỗi app/package extends từ đây.

---

## Tóm tắt kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    MONOREPO ROOT                         │
│              (pnpm workspaces + Turborepo)               │
├─────────────┬──────────────┬──────────────┬─────────────┤
│  apps/web   │ apps/api-*   │ apps/worker  │ apps/mobile │
│  (Next.js)  │  (NestJS)    │  (NestJS)    │   (Expo)    │
├─────────────┴──────────────┴──────────────┴─────────────┤
│                   packages/ (shared)                     │
│  @workspace/ui  @ac/common  @ac/models-*  @ac/utils ...  │
└─────────────────────────────────────────────────────────┘
         │                          │
    Keycloak (Auth)          GraphQL / REST APIs
    next-auth                (microservices ngoài)
```

**Luồng xác thực:** Web → Keycloak → next-auth → Protected routes
**Luồng dữ liệu:** Web → Apollo Client (GraphQL) / Axios (REST) → Backend APIs
**State management:** Zustand (global) + TanStack Query (server state)
**Routing:** Next.js App Router với route groups `(admin)` / `(guest)`
