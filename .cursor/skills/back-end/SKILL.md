---
name: app-city-cms-back-end
description: Best practices for App City CMS backend — NestJS, TypeORM, DTO validation. Auto-loads rules from rules/ by file pattern when Layer=Backend or editing apps/api, packages/api-models, packages/shared/dto. Use workflows/load-rules.md — do not list rules in specs.
metadata:
  author: app-city-cms-team
  version: "1.1.0"
---

# App City CMS — Back-end Practices

Conventions extracted from `.cursorrules`. **16 rules** — loaded on demand, không load hết vào memory.

## Auto-load (bắt buộc)

Khi task **Layer = Backend** hoặc sửa backend files:

1. Đọc **[workflows/load-rules.md](workflows/load-rules.md)**
2. **Bước 2a** — quét mô tả task, khớp field `description` trong frontmatter rule → load trước (vd: filter/phân trang → `repo-apply-list-query-filters`)
3. **Bước 2b** — load rule khớp file đang sửa (bảng pattern → rule)
4. Module e-ticket (`packages/api-models`) → đọc thêm **[overrides/e-ticket.md](overrides/e-ticket.md)**

Spec/prompt **chỉ** khai báo skill path — **không** liệt kê rule từng dòng.

## Monorepo layout

```
apps/
├── api/src/{module}/{feature}/   ← controller, service, module, dto/
└── workflow/src/                 ← workflow API modules

packages/
├── models/src/
│   ├── entity/                   ← TypeORM entities
│   ├── data-access/              ← Custom repositories
│   ├── database.module.ts
│   ├── database.service.ts
│   └── typeorm-config.service.ts
├── common/                       ← @ac/common — GetListQueryBaseDto, Route
├── be/                           ← @ac/be — AcRequest, NextAuthMiddleware
└── data-types/                   ← Enums shared FE/BE
```

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | NestJS Module | CRITICAL | `nest-` |
| 2 | Repository / DB | CRITICAL | `repo-` |
| 3 | DTO & Validation | HIGH | `dto-` |
| 4 | API & List Query | HIGH | `api-` |
| 5 | Auth & User Context | HIGH | `auth-` |
| 6 | TypeORM Entity | MEDIUM | `entity-` |
| 7 | Monorepo | LOW-MEDIUM | `mono-` |

## Quick Reference

### 1. NestJS Module (CRITICAL)

- `nest-thin-controller` — Controller chỉ routing + Swagger; logic ở service
- `nest-acrequest-user-context` — Lấy userId/orgUnitId qua AcRequest trong service, không truyền từ controller
- `nest-nextauth-middleware` — Register NextAuthMiddleware trong module configure()
- `nest-controller-route-pattern` — @Route + @Controller + @Queries() + findAllAndCount naming

### 2. Repository / DB (CRITICAL)

- `repo-custom-repository-class` — Query phức tạp trong @Injectable() repository
- `repo-apply-list-query-filters` — **Auto-load theo description** (filter, bộ lọc, phân trang…) — một hàm `applyListQueryFilters` từ `@ac/api-common`
- `repo-soft-delete-keyword` — Soft delete qua status; generateKeywordFromObject
- `repo-register-entity-three-places` — Register entity ở database.module, database.service, typeorm-config

### 3. DTO & Validation (HIGH)

- `dto-trim-string-transform` — trimString/trimStringOptional trước validation
- `dto-vietnamese-messages` — Message validation tiếng Việt
- `dto-decorator-order` — Swagger → Transform → Validation → Optional

### 4. API & List Query (HIGH)

- `api-find-all-and-count` — findAllAndCount cho list có pagination; findAll chỉ cho catalog

### 5. Auth & User Context (HIGH)

- `auth-acrequest-not-controller-param` — Không dùng @CurrentUser() hay truyền userId từ controller

### 6. TypeORM Entity (MEDIUM)

- `entity-ac-base-entity` — Extend AcBaseEntity cho audit fields
- `entity-plural-table-comments` — Table plural snake_case; comment tiếng Việt mọi column
- `entity-db-type-helpers` — DB_TYPE helpers; không dùng boolean (Oracle 19c)

### 7. Monorepo (LOW-MEDIUM)

- `mono-package-boundaries` — Models → @ac/models; DTO trong apps/api; không import xuyên app

## How to Use

Rule files nằm trong `rules/`. Agent **không** đọc hết — follow `workflows/load-rules.md`.

Each rule: explanation, incorrect example, correct example.
