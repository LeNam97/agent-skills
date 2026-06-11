---
title: Package Boundaries
impact: LOW-MEDIUM
impactDescription: Clear separation between data, API, and shared utilities
tags: monorepo, packages, imports
---

## Package Boundaries

| Concern | Package | Path |
|---------|---------|------|
| Entities + Repositories | `@ac/models` | `packages/models/` |
| List query helpers, Route | `@ac/common` | `packages/common/` |
| AcRequest, trimString | `@ac/be` | `packages/be/` |
| Enums | `@ac/data-types` | `packages/data-types/` |
| DTOs (request validation) | Feature module | `apps/api/src/{module}/{feature}/dto/` |
| NestJS modules | App | `apps/api/src/` |

**Incorrect:**

```typescript
// Import entity bằng relative path xuyên app
import { MyEntity } from '../../../packages/models/src/entity/my-entity.entity'

// Business query trong controller
```

**Correct:**

```typescript
import { MyEntityRepository } from '@ac/models'
import { GetListQueryBaseDto, Route } from '@ac/common'
import { AcRequest, trimString } from '@ac/be'
```

DTO đặt trong `apps/api/src/{module}/{feature}/dto/`, không copy vào nhiều apps.

