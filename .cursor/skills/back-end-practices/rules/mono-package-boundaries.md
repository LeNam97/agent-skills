---
title: Respect Monorepo Package Boundaries
impact: LOW-MEDIUM
impactDescription: Clear imports prevent circular deps and wrong-layer coupling
tags: monorepo, packages, architecture, imports
---

## Respect Monorepo Package Boundaries

| Package | Scope | Import as |
|---------|-------|-----------|
| `api-models` | Entities, repositories, DB module | `@ac/models` |
| `shared` | DTOs, Redis base, shared types | `@workspace/shared` |
| `ui` | shadcn primitives, admin `mi/`, hooks | `@workspace/ui` |
| `permissions` | Permission constant catalogs | `@workspace/permissions` |
| `api-queue` | RabbitMQ service bus | `@ac/api-queue` |
| `api-utils` | Env, date, permission helpers | `@ac/utils` |

**Incorrect (UI import entity TypeORM trực tiếp):**

```typescript
// packages/ui/src/mi/bookings-table.tsx
import { Bookings } from "@ac/models/entity/bookings.entity";
import { getRepository } from "typeorm";
```

**Correct:**

```typescript
// UI — chỉ DTO/types và fetch API
import type { CreateBookingsDto } from "@workspace/shared";
import { useTable } from "@workspace/ui/hooks/use-table";

// Nest feature — models + api-common
import { BookingsRepository } from "@ac/models";
import { BookingListQueryDto } from "@ac/api-common";

// Permissions — catalog only
import { PM01_QUAN_LY_BOOKING } from "@workspace/permissions";
```

Feature module (`demo/bookings/`) không định nghĩa entity — import từ `@ac/models`.

Reference: `demo/packages/shared/README.md`, `demo/bookings/bookings.module.ts`
