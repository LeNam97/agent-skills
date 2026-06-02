---
name: demo-eticket-practices
description: Best practices for the AC e-ticket monorepo in demo/ — NestJS modules, TypeORM repositories, shared DTOs, NextAuth middleware, permissions, and admin UI tables. Use when writing, reviewing, or refactoring code under demo/, bookings features, packages/api-models, packages/shared, packages/ui, or packages/permissions.
metadata:
  author: nodeJs-team
  version: "1.0.0"
---

# Demo E-Ticket Monorepo Practices

Conventions extracted from `demo/` — Vietnamese e-ticket platform (NestJS + TypeORM + Next.js admin UI). Contains 17 rules across 8 categories.

## When to Apply

Reference when working in:
- `demo/bookings/` — Nest feature modules
- `demo/packages/api-models/` — entities, repositories, database
- `demo/packages/shared/` — shared DTOs (`class-validator`)
- `demo/packages/ui/` — admin tables, shadcn, TanStack Query/Table
- `demo/packages/permissions/` — permission constants

## Monorepo layout

```
demo/
├── bookings/                    ← Nest feature (controller, service, module)
└── packages/
    ├── api-models/              ← @ac/models — TypeORM entities + repositories
    ├── shared/                  ← @workspace/shared — DTOs
    ├── ui/                      ← @workspace/ui — admin UI components
    ├── permissions/             ← @workspace/permissions
    ├── api-queue/               ← @ac/api-queue — RabbitMQ (optional)
    └── api-utils/               ← @ac/utils — env, permissions helper
```

External deps (not in `demo/`): `@ac/api-common`, `src/core` (`withNextAuthMiddleware`).

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | NestJS Module | CRITICAL | `nest-` |
| 2 | Repository / DB | CRITICAL | `repo-` |
| 3 | DTO & Validation | HIGH | `dto-` |
| 4 | API & List Query | HIGH | `api-` |
| 5 | Auth & Permissions | HIGH | `auth-` |
| 6 | TypeORM Entity | MEDIUM | `entity-` |
| 7 | Admin UI | MEDIUM | `ui-` |
| 8 | Monorepo | LOW-MEDIUM | `mono-` |

## Quick Reference

### 1. NestJS Module (CRITICAL)

- `nest-thin-controller` - Controller chỉ routing + Swagger; logic ở service
- `nest-module-auth-middleware` - Wrap module bằng `withNextAuthMiddleware`
- `nest-request-scoped-service` - Dùng `Scope.REQUEST` khi cần user context

### 2. Repository / DB (CRITICAL)

- `repo-custom-repository-class` - Query phức tạp trong `@Injectable()` repository, không trong controller
- `repo-selective-query-builder-joins` - `leftJoin` + `addSelect` thay vì load full relations
- `repo-batch-in-query` - Batch fetch với `In()` thay vì query trong loop

### 3. DTO & Validation (HIGH)

- `dto-shared-package` - DTO dùng chung đặt trong `@workspace/shared`, validate bằng `class-validator`
- `dto-vietnamese-messages` - Message validation tiếng Việt, khớp domain

### 4. API & List Query (HIGH)

- `api-list-query-dto` - List endpoint dùng `BookingListQueryDto` + `@Queries()` + `applyListQueryFilters`
- `api-route-order-specific-first` - Route cụ thể (`phan-trang`, `theo-tau/:id`) trước `:id`
- `api-not-found-exception` - `NotFoundException` với message tiếng Việt khi không tìm thấy

### 5. Auth & Permissions (HIGH)

- `auth-permission-constants` - Permission key dạng `SCREAMING_SNAKE` trong `@workspace/permissions`
- `auth-swagger-bearer` - `@ApiBearerAuth()` trên controller cần auth

### 6. TypeORM Entity (MEDIUM)

- `entity-synchronize-false` - `synchronize: false`; schema qua migration
- `entity-snake-case-columns` - Cột DB snake_case, prefix domain (`th_`, `tt_`, `ht_`)

### 7. Admin UI (MEDIUM)

- `ui-table-server-pagination` - `use-table` + TanStack manual pagination, contract `{ items, total, page, pageSize }`

### 8. Monorepo (LOW-MEDIUM)

- `mono-package-boundaries` - Models/repos → `@ac/models`; DTO → `@workspace/shared`; UI → `@workspace/ui`

## How to Use

```
rules/nest-thin-controller.md
rules/repo-selective-query-builder-joins.md
```

Each rule: explanation, incorrect example, correct example from `demo/` patterns.

Reference implementation: `demo/bookings/bookings.controller.ts`, `bookings.service.ts`, `packages/api-models/src/data-access/bookings.repository.ts`.
