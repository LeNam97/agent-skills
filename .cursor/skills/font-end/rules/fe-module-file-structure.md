---
title: Module File Structure
impact: HIGH
impactDescription: Predictable feature layout for list, create, edit, detail
tags: structure, module, app-router
---

## Module File Structure

Mỗi entity module gồm **2 phần**: route module (UI) + domain module (API, types, constants).

`page.tsx` chỉ re-export, không logic. API/types/constants nằm trong `domains/`, không trong route.

**Incorrect:**

```text
apps/web/app/(pm1)/my-entity/
├── page.tsx    # 500 lines list + form + API inline
└── my-entity.api.ts  # ❌ API không đặt trong route
```

**Correct:**

```text
# Route module — chỉ chứa UI
apps/web/app/(module)/my-entity/
├── page.tsx                    # export { MyEntityListPage as default }
├── my-entity.list.tsx          # List + table + filters
├── fn.ts                       # getStatusText, getStatusVariant
├── create/
│   ├── page.tsx
│   └── my-entity-form.tsx
└── [id]/
    ├── page.tsx                # Detail
    └── edit/page.tsx           # Edit

# Domain module — API, types, constants
apps/web/domains/my-entity/
├── service.ts                  # apiRequest CRUD functions
├── types.ts                    # Response/payload types
├── constants.ts                # Hằng số, enums
└── index.ts                    # Barrel export
```

```tsx
// page.tsx
import { MyEntityListPage } from './my-entity.list'
export default function Page() {
  return <MyEntityListPage />
}
```

```tsx
// Import API từ domain, không từ route
import { getListMyEntity } from '@/domains/my-entity'
```

