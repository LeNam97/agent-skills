---
title: Import and File Naming Patterns
impact: MEDIUM
impactDescription: Consistent module resolution across monorepo
tags: imports, naming, conventions
---

## Import and File Naming Patterns

| Type | Convention | Example |
|------|------------|---------|
| Pages | `page.tsx` | App Router |
| Components | kebab-case.tsx | `my-entity-form.tsx` |
| Utilities | camelCase.ts | `generateQueryParams.ts` |
| Constants | SCREAMING_SNAKE | `CATEGORY_TYPE_VALUES` |

**Incorrect:**

```tsx
import { Button } from '../../../packages/ui/src/components/button'
import authConfig from '../../server/auth/config'
```

**Correct:**

```tsx
import { Button } from '@workspace/ui/components/button'
import { useDebounce } from '@workspace/ui/hooks/use-debounce'
import { cn } from '@workspace/ui/lib/utils'
import { authConfig } from '~/server/auth/config'
import { RenderColumn } from '@/components/render-column'
```

Server Components by default; `'use client'` khi cần hooks/interactivity.

