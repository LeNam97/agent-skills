---
title: use client on List Pages
impact: CRITICAL
impactDescription: Hooks and interactivity require client component
tags: list, client-component, nextjs
---

## use client on List Pages

List pages **PHẢI** có `'use client'` directive vì dùng hooks (router, session, table, state).

**Incorrect:**

```tsx
// my-entity.list.tsx — thiếu directive
import { useRouter } from 'next/navigation'

export function MyEntityListPage() {
  const router = useRouter()
  // ...
}
```

**Correct:**

```tsx
'use client'

import { useRouter } from 'next/navigation'

export function MyEntityListPage() {
  const router = useRouter()
  // ...
}
```

`page.tsx` có thể là Server Component, chỉ re-export list component.

