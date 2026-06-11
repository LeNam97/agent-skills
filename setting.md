# BTP Backoffice Web - Cấu trúc & Cấu hình hệ thống

## Mục lục

- [1. Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
- [2. Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
- [3. Cấu hình Package Manager & Build](#3-cấu-hình-package-manager--build)
- [4. Cấu hình Database](#4-cấu-hình-database)
- [5. Cấu hình Redis](#5-cấu-hình-redis)
- [6. Cấu hình Next.js (Frontend)](#6-cấu-hình-nextjs-frontend)
- [7. Cấu hình NestJS (Backend)](#7-cấu-hình-nestjs-backend)
- [8. Cấu hình Authentication](#8-cấu-hình-authentication)
- [9. Cấu hình Socket (WebSocket)](#9-cấu-hình-socket-websocket)
- [10. Cấu hình Docker & CI/CD](#10-cấu-hình-docker--cicd)
- [11. Biến môi trường (Environment Variables)](#11-biến-môi-trường-environment-variables)
- [12. Hướng dẫn khởi chạy Development](#12-hướng-dẫn-khởi-chạy-development)

---

## 1. Tổng quan kiến trúc

**App City CMS** (`mi-admin`) là hệ thống quản lý nội dung đô thị (Trợ giúp pháp lý - TGPL) được xây dựng theo kiến trúc **monorepo**.

### Kiến trúc tổng quan (Development)

```
Browser :3000 (Next.js)
    │
    ├─ /api/auth/*      → NextAuth (cùng host)
    ├─ /ac-apis/*        → rewrite → NestJS API :3001
    ├─ /ac-socket/*      → rewrite → Socket :3005
    └─ /socket.io/*      → rewrite → Socket :3005

Session chia sẻ:
  Cookie (authjs.session-token)
  + Redis (nextjs-session:{userId}:{sessionId})
  → NestJS NextAuthMiddleware validate cả hai
```

### Tech Stack

| Thành phần     | Công nghệ                                      |
| -------------- | ----------------------------------------------- |
| Frontend       | Next.js 15+, React 19, TypeScript 5.8           |
| Backend        | NestJS 11, TypeORM                              |
| UI Library     | Tailwind CSS 4.0, shadcn/ui (`@workspace/ui`)   |
| State          | TanStack Query, React Hook Form, Zustand         |
| Auth           | NextAuth 5.0 beta (Auth.js v5)                  |
| Database       | Oracle DB (production), PostgreSQL (development) |
| Cache          | Redis (ioredis)                                  |
| Workflow       | Temporal (legacy), DB State Machine (hiện tại)   |
| i18n           | next-intl (Vietnamese/English)                   |
| Build          | Turbo, pnpm 10.4.1                              |
| Package Manager| pnpm 10.4.1 workspace                           |
| Node.js        | >= 20                                            |

---

## 2. Cấu trúc thư mục

### Cấu trúc tổng thể

```
btp-backoffice-web/
├── apps/                          # Các ứng dụng
│   ├── web/                       # Next.js Frontend (port 3000)
│   ├── api/                       # NestJS Main API (port 3001)
│   ├── socket/                    # NestJS WebSocket Service (port 3005)
│   ├── migrate-db/                # NestJS Migration/Sync Service
│   ├── worker/                    # [STUB] Temporal Worker (không có source)
│   └── workflow/                  # [STUB] Workflow Service (không có source)
├── packages/                      # Shared packages
│   ├── ui/                        # @workspace/ui - Shared UI components
│   ├── models/                    # @ac/models - TypeORM entities, repos, migrations
│   ├── be/                        # @ac/be - Backend utilities, middleware
│   ├── common/                    # @ac/common - NestJS decorators, validation
│   ├── utils/                     # @ac/utils - General utilities (wrap @btp/utils)
│   ├── bpmn/                      # @ac/bpmn - Temporal/BPMN workflow
│   ├── data-types/                # @ac/data-types - Shared enums, constants
│   ├── permissions/               # @ac/permissions - Role/permission constants
│   ├── i18n/                      # @ac/i18n - Backend i18n
│   ├── eslint-config/             # @workspace/eslint-config
│   └── typescript-config/         # @workspace/typescript-config
├── docker/                        # Production Dockerfiles
├── scripts/                       # Shell scripts (start DB, Redis, backup)
├── tools/                         # Dev utilities (swagger, DTO scan)
├── docs/                          # Tài liệu (Oracle setup, deploy, BPMN)
├── coding/                        # Implementation guides
├── tests/k6/                      # Load testing
└── .gitlab-ci.yml                 # CI/CD pipeline
```

### Chi tiết `apps/web` (Frontend)

```
apps/web/
├── app/                           # Next.js App Router
│   ├── (admin)/                   # Admin layout group
│   ├── (guest)/                   # Guest layout group (sign-in)
│   ├── (pm1)/                     # PM1 module pages
│   ├── (pm2)/                     # PM2 module pages
│   ├── (pm3)/                     # PM3 module pages
│   ├── (pm4)/                     # PM4 module pages
│   └── api/auth/                  # NextAuth API routes
├── components/                    # App-specific components
├── lib/                           # Utilities, types
├── messages/                      # i18n messages (vi, en)
├── server/                        # Server-side code
│   ├── auth/                      # NextAuth config
│   └── redis.ts                   # Redis client
├── services/                      # API request functions
├── stores/                        # Zustand stores
├── hooks/                         # Custom hooks
├── constants/                     # App constants
├── env.js                         # Zod env validation
├── next.config.mjs                # Next.js config
└── Dockerfile                     # Standalone Docker build
```

### Chi tiết `apps/api` (Backend)

```
apps/api/
├── src/
│   ├── core/                      # Core modules
│   │   ├── authentications/       # Auth service
│   │   ├── common/                # Common services
│   │   │   └── redis/             # Redis modules & services
│   │   ├── data-initialization/   # Seed data service
│   │   └── ...
│   ├── pm1/                       # PM1 API modules
│   │   ├── workflow/              # Workflow V2 (DB state machine)
│   │   ├── case-advance/          # Quản lý vụ việc
│   │   └── ...
│   ├── pm2/                       # PM2 API modules
│   ├── pm6/                       # PM6 API modules
│   ├── partner/                   # Partner API
│   ├── schedules/                 # Cron jobs
│   ├── app.module.ts              # Root module
│   ├── bootstrap.ts               # App bootstrap
│   └── main.ts                    # Entry point
├── swaggers/                      # Swagger documentation
├── nest-cli.json                  # Nest CLI config
├── tsoa.json                      # OpenAPI generation
└── .env.dev.example               # Env template
```

### Chi tiết `packages/models` (Data Layer)

```
packages/models/src/
├── entity/                        # TypeORM entities
│   ├── ac-base-entity.ts          # Base entity (audit fields)
│   ├── base-timestamp.entity.ts   # Base entity (timestamps only)
│   ├── db.fn.ts                   # Cross-DB column types, UUID gen
│   ├── types/                     # Enums, type definitions
│   └── *.entity.ts                # Entity files
├── data-access/                   # Repository pattern
│   └── *.repository.ts            # Custom repositories
├── migration/                     # TypeORM migrations
├── seeds/                         # Seed scripts
│   └── data/                      # JSON seed data (git submodule)
├── orm-entities.ts                # Central entity registry (TYPEORM_ENTITIES)
├── database.module.ts             # NestJS DatabaseModule
├── database.service.ts            # DatabaseService (inject repositories)
├── typeorm-config.service.ts      # TypeORM runtime config
├── data-source.ts                 # TypeORM CLI entry (dotenv + re-export)
├── data-source.main.ts            # DataSource cho migrations/seeds
├── oracle-json-safe-upsert.ts     # Oracle JSON patch
└── generate-frontend-types.ts     # Auto-gen frontend types
```

---

## 3. Cấu hình Package Manager & Build

### pnpm Workspace (`pnpm-workspace.yaml`)

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'docs/devtools'

onlyBuiltDependencies:
  - '@nestjs/core'
  - '@temporalio/core-bridge'
  - oracledb
  - esbuild
  - sharp
  # ...
```

### Turbo (`turbo.json`)

```json
{
  "globalEnv": ["SKIP_ENV_VALIDATION", "NEXT_TELEMETRY_DISABLED"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": { "dependsOn": ["^lint"] },
    "check-types": { "dependsOn": ["^check-types"] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

### Các lệnh chính (`package.json` root)

| Lệnh                        | Mô tả                                             |
| ---------------------------- | -------------------------------------------------- |
| `pnpm start:web`             | Chạy Next.js frontend (port 3000)                  |
| `pnpm start:api`             | Chạy NestJS API (port 3001)                        |
| `pnpm start:socket`          | Chạy Socket service (port 3005)                    |
| `pnpm start:docker`          | Khởi tạo Postgres + Redis containers               |
| `pnpm start:temporal`        | Chạy Temporal dev server (UI port 8080)             |
| `pnpm start:migrate-db`      | Chạy Migration/Sync service                        |
| `pnpm build`                 | Build web (Next.js)                                |
| `pnpm build:api`             | Build API (NestJS)                                 |
| `pnpm build:socket`          | Build Socket service                               |
| `pnpm dev:all`               | Turbo dev tất cả                                   |
| `pnpm lint`                  | Lint tất cả packages                               |
| `pnpm format`                | Format code bằng Prettier                          |
| `pnpm check-types`           | TypeScript type checking                           |
| `pnpm migration:run`         | Chạy pending migrations                            |
| `pnpm migration:revert`      | Revert migration cuối                              |
| `pnpm migration:show`        | Hiển thị trạng thái migrations                     |
| `pnpm migration:create`      | Tạo migration file rỗng                            |
| `pnpm migration:generate`    | Generate migration từ entity diff                  |
| `pnpm seed:create`           | Tạo seed file mới                                  |

### Các cấu hình khác

| File                   | Mô tả                                                    |
| ---------------------- | --------------------------------------------------------- |
| `.eslintrc.js`         | Root ESLint (sử dụng shared config)                       |
| `.prettierrc`          | Prettier: 120 width, single quotes, import sort plugins   |
| `commitlint.config.js` | Conventional commits (husky pre-commit hook)              |
| `sonar-project.properties` | SonarQube static analysis                            |
| `.npmrc`               | Private npm registry cho `@btp/*` packages (GitLab)       |
| `tsconfig.json`        | Root TS config (extends `@workspace/typescript-config`)    |
| `tsconfig.nestjs.json` | NestJS TS config với path aliases `@ac/*`                  |

---

## 4. Cấu hình Database

### 4.1. Chiến lược Dual-Database

Project hỗ trợ **hai loại database** chuyển đổi qua biến môi trường `DB_TYPE`:

| Môi trường   | Database   | Kết nối                                   |
| ------------ | ---------- | ----------------------------------------- |
| Production   | Oracle DB  | Host/port/username/password + SID/Service  |
| Development  | PostgreSQL | Connection URL (`DB_URL`)                  |

### 4.2. TypeORM Configuration

#### Runtime Config (`typeorm-config.service.ts`)

File: `packages/models/src/typeorm-config.service.ts`

```typescript
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    // Phân biệt Oracle vs Postgres qua AC_ENVS.DB_TYPE
    if (AC_ENVS.DB_TYPE === 'oracle') {
      // Sử dụng: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD
      // Nếu DB_CONNECTION_KIND === 'sid' → dùng SID
      // Ngược lại → dùng serviceName
    } else {
      // Sử dụng: DB_URL (connection string)
    }

    return {
      type: AC_ENVS.DB_TYPE,
      ...options,
      logging: false,
      poolSize: 10,           // Connection pool size
      entities: TYPEORM_ENTITIES,
      synchronize: process.env.DB_SYNCHRONIZE === '1',
    }
  }
}
```

**Các thông số quan trọng:**

| Thông số      | Giá trị     | Ghi chú                                |
| ------------- | ----------- | --------------------------------------- |
| `poolSize`    | `10`        | Số connections tối đa trong pool        |
| `logging`     | `false`     | Có thể bật qua `DB_LOGGING='1'`        |
| `synchronize` | Env-driven  | `DB_SYNCHRONIZE='1'` để bật (dev only)  |
| SSL/TLS       | Không có    | Connections qua plain TCP               |

#### CLI DataSource (`data-source.main.ts`)

File: `packages/models/src/data-source.main.ts`

Dùng cho TypeORM CLI (migrations, seeds):

```typescript
export const AppDataSource = new DataSource({
  migrations: ['packages/models/src/migration/*.{ts,js}'],
  type: AC_ENVS.DB_TYPE,
  ...options,
  logging: false,
  namingStrategy: new AcCustomNamingStrategy(),
  migrationsTableName: 'ac_migrations',
  entities: TYPEORM_ENTITIES,
  synchronize: false,  // Luôn false cho CLI
})
```

#### Database Module (`database.module.ts`)

File: `packages/models/src/database.module.ts`

```typescript
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      async dataSourceFactory(options) {
        installOracleJsonSafeUpsertPatch()   // Patch JSON cho Oracle
        deleteDataSourceByName('default')
        initializeTransactionalContext({ storageDriver: StorageDriver.AUTO })
        const dataSource = new DataSource({
          ...options,
          namingStrategy: new AcCustomNamingStrategy(),
        })
        return addTransactionalDataSource(dataSource) // typeorm-transactional
      },
    }),
    TypeOrmModule.forFeature(TYPEORM_ENTITIES),
  ],
  providers: [DatabaseService, ...AllRepositories],
  exports: [DatabaseService, ...AllRepositories],
})
export class DatabaseModule {}
```

### 4.3. Cross-Database Helpers (`db.fn.ts`)

File: `packages/models/src/entity/db.fn.ts`

`DB_TYPE` cung cấp column types tương thích cả Oracle và Postgres:

| Concern    | Oracle              | PostgreSQL          |
| ---------- | ------------------- | ------------------- |
| VARCHAR    | `nvarchar2`         | `varchar`           |
| TEXT       | `nvarchar2(16383)`  | `text`              |
| UUID PK    | `char(36)` + `SYS_GUID()` | `uuid` + `generated: 'uuid'` |
| NUMBER     | `number`            | `integer`           |
| BIGINT     | `number`            | `bigint`            |
| JSON       | Dùng `jsonTransformer` | Native JSON       |

Cũng cung cấp: `AcCustomNamingStrategy` (uppercase table/column names, custom FK/PK names).

### 4.4. Entity Registration

#### Central Registry (`orm-entities.ts`)

Tất cả entities được export từ `TYPEORM_ENTITIES` (~125 entities). Array này được dùng tại:

1. `TypeOrmConfigService` → `entities`
2. `data-source.main.ts` → `entities`
3. `database.module.ts` → `TypeOrmModule.forFeature(TYPEORM_ENTITIES)`

#### Base Entity Classes

**`AcBaseEntity`** — Entity cơ bản với audit fields (KHUYẾN NGHỊ dùng cho hầu hết entities):

```typescript
export class AcBaseEntity {
  @Column(DB_TYPE.UUID, { ...DB_TYPE.getUuidRelation(), nullable: true })
  updatedById?: string

  @Column(DB_TYPE.UUID, { ...DB_TYPE.getUuidRelation(), nullable: true })
  createdById?: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedById' })
  updatedBy?: User

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy?: User

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date
}
```

**`BaseTimestampEntity`** — Chỉ có timestamps (không có audit user):

```typescript
export class BaseTimestampEntity {
  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
```

**Khi tạo Entity mới, phải register ở 3 nơi:**

1. `orm-entities.ts` → Thêm vào `TYPEORM_ENTITIES`
2. `database.module.ts` → `TypeOrmModule.forFeature()` (tự động qua `TYPEORM_ENTITIES`)
3. `database.service.ts` → `@InjectRepository(MyEntity)` để inject repository

### 4.5. Migration

| Thông tin         | Giá trị                                           |
| ----------------- | -------------------------------------------------- |
| Thư mục           | `packages/models/src/migration/`                    |
| Naming            | `{timestamp}-{name}.ts`                             |
| Migration table   | `ac_migrations`                                     |
| DataSource        | `packages/models/src/data-source.ts`                |

**Các lệnh migration:**

```bash
# Chạy migrations
pnpm migration:run

# Revert migration cuối cùng
pnpm migration:revert

# Xem trạng thái migrations
pnpm migration:show

# Tạo migration rỗng
pnpm migration:create --name=MyMigration

# Generate migration từ entity diff (+ fix Oracle escapes)
pnpm migration:generate --name=MyMigration
```

### 4.6. Seeds

| Thông tin     | Giá trị                                           |
| ------------- | -------------------------------------------------- |
| Thư mục       | `packages/models/src/seeds/`                        |
| Data files    | `packages/models/src/seeds/data/` (git submodule)   |
| Framework     | `typeorm-extension` (`Seeder` classes)               |
| Runtime seed  | API endpoint qua `DataInitializationService`         |

```bash
# Tạo seed file mới
pnpm seed:create --name=MySeed
```

### 4.7. Cấu hình Database cho PostgreSQL (Development)

**Bước 1: Cấu hình `.env`**

Tạo file `apps/api/.env` từ template:

```bash
cp apps/api/.env.dev.example apps/api/.env
```

Sửa phần DB:

```env
DB_TYPE='postgres'
DB_URL='postgresql://postgres:postgres@localhost:5432/ac-monorepo'
DB_SYNCHRONIZE='1'    # Tự động sync schema (chỉ dùng cho dev)
DB_LOGGING='0'
```

**Bước 2: Khởi chạy PostgreSQL container**

```bash
pnpm start:docker
# Hoặc chạy riêng:
./scripts/start-database.sh
```

Script sẽ:
- Đọc `DB_URL` từ `apps/api/.env`
- Parse password, port, database name
- Tạo Docker container PostgreSQL với thông tin tương ứng

### 4.8. Cấu hình Database cho Oracle (Production)

**Bước 1: Cấu hình `.env`**

```env
DB_TYPE='oracle'
DB_NAME='TGPL_DB_DEV'
DB_HOST='localhost'
DB_PORT='1521'
DB_USERNAME='YOUR_FPT_ACCOUNT_UPPERCASE'
DB_PASSWORD='Abcd123456'
DB_SYNCHRONIZE='0'    # Không bật synchronize cho Oracle
```

**Bước 2: Khởi chạy Oracle container (optional)**

```bash
cd docs/oracle/26ai
docker-compose up -d
```

Docker Compose file (`docs/oracle/26ai/docker-compose.yml`):

```yaml
services:
  oracle:
    image: container-registry.oracle.com/database/free:latest
    container_name: oracle-local
    ports:
      - "1521:1521"
    environment:
      - ORACLE_PWD=Abcd123456
    entrypoint: ["/bin/bash", "/home/oracle/scripts/entrypoint.sh"]
    volumes:
      - ./scripts:/home/oracle/scripts
      - ./data:/home/oracle/data
      - oracle-data:/opt/oracle/oradata
```

Chi tiết setup Oracle: xem `docs/oracle/26ai/init-oracle-db.md`

---

## 5. Cấu hình Redis

### 5.1. Biến môi trường

| Biến              | Ví dụ                                  | Mô tả                     |
| ----------------- | -------------------------------------- | -------------------------- |
| `REDIS_URL`       | `redis://:Abc123456@localhost:6379`    | Connection URL             |
| `REDIS_CHAT_DB`   | `9`                                    | Redis DB index cho chat    |
| `AC_REDIS_DISABLE`| `0` hoặc `1`                           | Tắt Redis reads (test)     |

### 5.2. Redis trong các service

| Service    | Module                                    | Mục đích                              |
| ---------- | ----------------------------------------- | ------------------------------------- |
| API        | `AcRedisModule` (global, ioredis)          | Caching, sessions, notifications       |
| Web        | `apps/web/server/redis.ts` (ioredis)       | NextAuth session storage              |
| Socket     | `redis.service.ts` (node-redis)            | Pub/sub notifications, chat storage   |
| Socket     | `redis-io-adapter.ts`                      | Socket.IO Redis adapter (multi-instance) |

### 5.3. Redis Services trong API

- `OrgRedisService` — Cache thông tin tổ chức
- `AuthenticationsRedisService` — Cache auth data
- `NotificationRedisService` — Publish notifications
- `NextAuthSessionRedisService` — Validate NextAuth sessions
- `SystemLogPolicyRedisService` — Cache system log policies
- `SessionPolicyRedisService` — Cache session policies

### 5.4. Base Redis Service (`@ac/be`)

`AcBaseRedisService` cung cấp: `getHelper`, `getJsonHelper`, hash-based cache, queues, rate limiting, Redis JSON commands.

### 5.5. Notification Flow

```
API (NotificationRedisService) → publish → Redis channel "notifications"
                                              ↓
Socket (RedisService) ← subscribe ← Redis channel "notifications"
                                              ↓
Socket (ChatGateway) → emit → Browser clients
```

### 5.6. Khởi chạy Redis

```bash
./scripts/start-redis.sh
# Tạo container "ac-redis" trên port 6379
```

---

## 6. Cấu hình Next.js (Frontend)

### File: `apps/web/next.config.mjs`

**Tính năng chính:**

| Tính năng             | Giá trị                                           |
| --------------------- | -------------------------------------------------- |
| i18n                  | `next-intl` plugin                                 |
| Output                | `standalone` (cho Docker)                          |
| Security headers      | CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| Proxy timeout         | `600_000ms` (10 phút)                             |
| Strict mode           | `false`                                            |

### API Rewrites (Development)

| Source Path           | Destination (Dev)                      | Service      |
| --------------------- | -------------------------------------- | ------------ |
| `/api/auth/:path*`    | Không rewrite (cùng host)              | NextAuth     |
| `/ac-apis/:path*`     | `http://127.0.0.1:3001/ac-apis/:path*` | NestJS API   |
| `/socket.io/:path*`   | `http://127.0.0.1:3005/socket.io/:path*` | Socket     |
| `/ac-socket/:path*`   | `http://127.0.0.1:3005/ac-socket/:path*` | Socket     |

> **Lưu ý:** Worker (`ac-worker-apis`) và Workflow (`ac-workflow-apis`) rewrites đã bị **comment out**.

### Environment Validation (`env.js`)

Sử dụng `@t3-oss/env-nextjs` với Zod schema validate các biến:
- `AUTH_SECRET`, `AUTH_TRUST_HOST`
- `KEYCLOAK_ID`, `KEYCLOAK_SECRET`, `KEYCLOAK_ISSUER`
- `REDIS_URL`
- `API_URL`, `API_KEY`, `API_SECRET`
- `NEXT_PUBLIC_PM03_PM04`, `NEXT_PUBLIC_SOCKET_URL`

---

## 7. Cấu hình NestJS (Backend)

### 7.1. Main API (`apps/api`)

| Thông số            | Giá trị                                   |
| ------------------- | ----------------------------------------- |
| Port                | `3001` (default từ `AC_ENVS.PORT`)         |
| Global prefix       | `ac-apis` (từ `AC_ENVS.GLOBAL_API_PREFIX`) |
| Swagger (Biz)       | `/ac-apis/docs` (cookie + basic + bearer)  |
| Swagger (Partner)   | `/ac-apis/partner-docs` (x-client-id/secret)|
| CORS                | `app.enableCors()` (mở mặc định)          |
| Multi-process       | Tùy chọn qua `MULTI_THEREAT_PROCESS='1'`  |

**Bootstrap flow:** `main.ts` → `AppClusterService.clusterize(bootstrap)` → NestJS app

### 7.2. Socket Service (`apps/socket`)

| Thông số            | Giá trị                                    |
| ------------------- | ------------------------------------------ |
| Port                | `3005` (default)                           |
| Global prefix       | `ac-socket`                                |
| WebSocket namespace | `/chat`                                    |
| WebSocket path      | `/ac-socket/ws`                            |
| Swagger             | `/ac-socket/docs`                          |
| CORS origin         | `http://localhost:3000` (default)          |

### 7.3. Migrate DB Service (`apps/migrate-db`)

| Thông số            | Giá trị                                    |
| ------------------- | ------------------------------------------ |
| Global prefix       | `migrate-db-apis`                          |
| Auth                | `API_KEY_MIGRATE_DB` / `API_SECRET_MIGRATE_DB` |

---

## 8. Cấu hình Authentication

### 8.1. NextAuth (Auth.js v5 beta)

| File                              | Vai trò                          |
| --------------------------------- | -------------------------------- |
| `apps/web/server/auth/config.ts`  | Cấu hình NextAuth chính         |
| `apps/web/server/auth/index.ts`   | Export `auth`, `handlers`, `signIn`, `signOut` |
| `apps/web/server/auth/adapter.ts` | Custom API adapter → NestJS      |
| `apps/web/app/api/auth/[...nextauth]/route.ts` | Route handlers     |

### 8.2. Session Strategy

- **Strategy:** JWT (không dùng database sessions)
- **Cookie (dev):** `authjs.session-token`
- **Cookie (prod):** `__Secure-authjs.session-token`

### 8.3. Auth Providers

1. **Credentials** — POST tới `${API_URL}/authentications/method/login`
2. **Keycloak** — VNeID SSO (`KEYCLOAK_ID/SECRET/ISSUER`)

### 8.4. Custom JWT + Redis Session

```
Encode: Token → JWT encode → Redis SET nextjs-session:{userId}:{sessionId} (TTL based on policy)
Decode: JWT decode → Redis GET nextjs-session:{userId}:{sessionId} → Nếu không có → null (expired)
```

### 8.5. Session chia sẻ: Next.js ↔ NestJS

1. Browser lưu **session cookie** (`authjs.session-token`)
2. Next.js lưu session payload vào **Redis** key `nextjs-session:{userId}:{sessionId}`
3. NestJS **`NextAuthMiddleware`** (`@ac/be`):
   - Đọc cookie qua `decodeToken(req)`
   - Verify Redis session qua `NextAuthSessionRedisService.hasSession(userId, sessionId)`
   - Load user, org, roles, permissions vào `req.metadata`
4. Middleware được apply per-module:
   ```typescript
   consumer.apply(NextAuthMiddleware).forRoutes('my-entity')
   ```

### 8.6. Server-to-Server Auth

Next.js → API: Sử dụng **Basic auth** headers (`API_KEY` / `API_SECRET`), không dùng user cookie.

Socket push notifications: `SocketBasicAuthMiddleware` với `SOCKET_API_KEY` / `SOCKET_API_SECRET`.

---

## 9. Cấu hình Socket (WebSocket)

### Kiến trúc

```
apps/socket/src/
├── main.ts                    # Entry point
├── bootstrap.ts               # NestJS app setup + CORS
├── socket.module.ts           # Root module
└── chat/
    ├── chat.gateway.ts        # WebSocket gateway (/chat)
    ├── chat.controller.ts     # REST push notifications
    ├── chat.service.ts        # Chat business logic
    ├── chat.module.ts         # Chat module
    ├── redis.service.ts       # Pub/sub notifications
    └── redis-io-adapter.ts    # Socket.IO Redis adapter
```

### CORS Config

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
})
```

### WebSocket Auth

- Session cookie (`authjs.session-token`) hoặc handshake token → `decryptToken()`

### Client connection

```typescript
// apps/web/lib/socket.ts
socket = io(`${NEXT_PUBLIC_SOCKET_URL}/chat`, {
  path: '/ac-socket/ws',
  withCredentials: true,
})
```

---

## 10. Cấu hình Docker & CI/CD

### 10.1. Dockerfiles

| File                       | Service        | Mô tả                                  |
| -------------------------- | -------------- | --------------------------------------- |
| `docker/DockerfileWeb2`    | `ac-web`       | Multi-stage, OpenShift Node 20          |
| `docker/DockerfileApi2`    | `ac-apis`      | Build `pnpm build:api`                  |
| `docker/DockerfileSocket2` | `ac-socket`    | Build `pnpm build:socket`               |
| `docker/DockerfileMigrateDb`| `ac-migrate-db`| Build `pnpm build:migrate-db`          |
| `docker/DockerfileWorker`  | Worker         | [Legacy] References missing source      |
| `docker/DockerfileWorkflow`| Workflow       | [Legacy] References missing source      |
| `docker/DockerfileWebCache`| Cache image    | Dependency cache cho CI                 |
| `docker/DockerfileBackendCache`| Cache image | Backend dependency cache                |
| `apps/web/Dockerfile`      | Standalone     | Turbo-prune Alpine build                |

### 10.2. GitLab CI (`.gitlab-ci.yml`)

**Stages:** `dev`, `uat`, `staging`, `cache`

**Registry:** OpenShift (`default-route-openshift-image-registry.apps.prod01.fis-cloud.fpt.com`)

**Platform:** `docker build --platform=linux/amd64`

| Job                    | Service          | Branch    | Trigger |
| ---------------------- | ---------------- | --------- | ------- |
| `ac-web-dev`           | `ac-web`         | `build`   | Manual  |
| `ac-web-uat`           | `ac-web`         | `develop` | Manual  |
| `ac-api-dev`           | `ac-apis`        | `build`   | Manual  |
| `ac-api-uat`           | `ac-apis`        | `develop` | Manual  |
| `ac-socket-dev`        | `ac-socket`      | `build`   | Manual  |
| `ac-socket-uat`        | `ac-socket`      | `develop` | Manual  |
| `ac-migrate-db-uat`    | `ac-migrate-db`  | `develop` | Manual  |

### 10.3. Kubernetes

File template: `docs/deploys/btp-tgpl-apis.service.yaml` — K8s ClusterIP Service (port 8080).

Các thư mục env-specific (`docs/deploys/uat`, `dev`, `prod`) đã được gitignore.

---

## 11. Biến môi trường (Environment Variables)

### 11.1. Setup

```bash
# Copy template files
cp apps/web/.env.dev.example apps/web/.env
cp apps/api/.env.dev.example apps/api/.env
cp apps/api/.env.dev.example apps/socket/.env
```

### 11.2. Web (`apps/web/.env`)

| Biến                    | Ví dụ                                                   | Mô tả                      |
| ----------------------- | ------------------------------------------------------- | --------------------------- |
| `NEXTAUTH_URL`          | `http://localhost:3000`                                  | NextAuth base URL           |
| `AUTH_TRUST_HOST`       | `http://localhost:3000`                                  | Trusted host                |
| `AUTH_SECRET`           | `7ePI+LbTtGl...`                                        | JWT signing secret          |
| `KEYCLOAK_ID`           | `sm-queue`                                               | Keycloak client ID          |
| `KEYCLOAK_SECRET`       | `FVg8XoNs...`                                            | Keycloak client secret      |
| `KEYCLOAK_ISSUER`       | `https://lemur-2.cloud-iam.com/auth/realms/...`          | Keycloak issuer URL         |
| `REDIS_URL`             | `redis://:password@localhost:6379`                       | Redis connection            |
| `API_URL`               | `http://localhost:3000/ac-apis`                          | API URL (qua Next proxy)    |
| `API_KEY`               | `ZDrOVBmVLtkHcmLV`                                      | API basic auth key          |
| `API_SECRET`            | `pATn7D7M7uBJ3lAD`                                      | API basic auth secret       |
| `NEXT_PUBLIC_PM03_PM04` | `1`                                                      | Feature flag PM03/PM04      |

### 11.3. API (`apps/api/.env`)

| Biến                     | Ví dụ                                           | Mô tả                         |
| ------------------------ | ----------------------------------------------- | ------------------------------ |
| `AC_ENV`                 | `dev`                                            | Môi trường                    |
| `DB_TYPE`                | `postgres` hoặc `oracle`                         | Loại database                 |
| `DB_URL`                 | `postgresql://postgres:postgres@localhost:5432/ac-monorepo` | Postgres URL          |
| `DB_HOST`                | `localhost`                                      | Oracle host                   |
| `DB_PORT`                | `1521`                                           | Oracle port                   |
| `DB_NAME`                | `TGPL_DB_DEV`                                    | Oracle DB name (SID/Service)  |
| `DB_USERNAME`            | `YOUR_FPT_ACCOUNT_UPPERCASE`                     | Oracle username               |
| `DB_PASSWORD`            | `Abcd123456`                                     | Oracle password               |
| `DB_SYNCHRONIZE`         | `0` hoặc `1`                                     | Auto sync schema              |
| `DB_LOGGING`             | `0` hoặc `1`                                     | SQL query logging             |
| `REDIS_URL`              | `redis://:Abc123456@localhost:6379`              | Redis connection              |
| `REDIS_CHAT_DB`          | `9`                                              | Redis DB cho chat             |
| `AUTH_SECRET`            | (same as web)                                    | JWT secret (phải giống web)   |
| `API_KEY`                | `ZDrOVBmVLtkHcmLV`                              | Basic auth key                |
| `API_SECRET`             | `pATn7D7M7uBJ3lAD`                              | Basic auth secret             |
| `SOCKET_API_KEY`         | `PukHiwvQoEmKNXHN`                              | Socket push auth key          |
| `SOCKET_API_SECRET`      | `PukHiwvQoEmKNXHN`                              | Socket push auth secret       |
| `NOTIFICATION_STRATEGY`  | `api`                                            | `api` hoặc `function`         |
| `MULTI_THEREAT_PROCESS`  | `1`                                              | Multi-process mode            |
| `SYSTEM_LOG_DB_ENABLED`  | `1`                                              | Log to DB                     |
| `STORAGE_CORE_S3_SERVERS`| JSON config                                      | S3 storage config             |

### 11.4. Biến mà `AC_ENVS` parse (từ `@btp/utils`)

| Biến                        | Default               | Mô tả                         |
| --------------------------- | --------------------- | ------------------------------ |
| `PORT`                      | `3001`                | API port                       |
| `GLOBAL_API_PREFIX`         | `ac-apis`             | API prefix                     |
| `DB_TYPE`                   | —                     | `oracle` hoặc `postgres`       |
| `DB_URL`                    | —                     | Postgres connection string     |
| `DB_HOST`                   | —                     | Oracle host                    |
| `DB_PORT`                   | —                     | Oracle port                    |
| `DB_NAME`                   | —                     | Oracle SID/Service name        |
| `DB_USERNAME`               | —                     | Oracle username                |
| `DB_PASSWORD`               | —                     | Oracle password                |
| `DB_CONNECTION_KIND`        | `service` (default)   | `sid` hoặc `service`           |
| `TEMPORAL_ADDRESS`          | `127.0.0.1:7233`      | Temporal server address        |
| `TEMPORAL_NAMESPACE`        | `default`             | Temporal namespace             |
| `AC_WORKFLOW_APIS_ENDPOINT` | `http://localhost:3000/ac-workflow-apis` | Workflow API   |

---

## 12. Hướng dẫn khởi chạy Development

### Bước 1: Cài đặt dependencies

```bash
pnpm install
```

### Bước 2: Cấu hình environment

```bash
# Copy template files
cp apps/web/.env.dev.example apps/web/.env
cp apps/api/.env.dev.example apps/api/.env
cp apps/api/.env.dev.example apps/socket/.env
```

Sửa `apps/api/.env` để dùng PostgreSQL cho local dev:

```env
DB_TYPE='postgres'
DB_URL='postgresql://postgres:postgres@localhost:5432/ac-monorepo'
DB_SYNCHRONIZE='1'
```

### Bước 3: Khởi chạy infrastructure

```bash
# Khởi chạy PostgreSQL + Redis containers
pnpm start:docker

# Hoặc chạy riêng lẻ:
./scripts/start-database.sh
./scripts/start-redis.sh
```

### Bước 4: Khởi chạy services

```bash
# Terminal 1: Start API
pnpm start:api

# Terminal 2: Start Web
pnpm start:web

# Terminal 3 (optional): Start Socket
pnpm start:socket
```

### Bước 5: Truy cập

| Service          | URL                                  |
| ---------------- | ------------------------------------ |
| Web Frontend     | http://localhost:3000                |
| API Swagger      | http://localhost:3000/ac-apis/docs   |
| Socket Swagger   | http://localhost:3005/ac-socket/docs |
| Temporal UI      | http://localhost:8080 (nếu chạy)     |

### Bước 6 (Optional): Khởi chạy Temporal

```bash
pnpm start:temporal
```

### Lưu ý quan trọng

- Tất cả API đều được proxy qua Next.js trên **port 3000** nhờ rewrites trong `next.config.mjs`
- `AUTH_SECRET` phải **giống nhau** giữa web và api `.env` để session hoạt động
- `API_KEY` / `API_SECRET` phải **khớp** giữa web và api cho server-to-server calls
- Oracle DB cần driver `oracledb` được build (đã configure trong `pnpm.onlyBuiltDependencies`)
- Sử dụng `DB_SYNCHRONIZE='1'` **chỉ cho development**, không dùng trong production
