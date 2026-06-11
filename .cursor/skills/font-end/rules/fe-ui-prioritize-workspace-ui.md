---
title: Prioritize @workspace/ui Components
impact: MEDIUM
impactDescription: Consistent design system, less duplication
tags: ui, components, workspace-ui
---

## Prioritize @workspace/ui Components

1. Dùng `@workspace/ui` trước khi tạo component mới
2. Component reusable → `packages/ui`
3. App-specific logic → `apps/web/components`

**Incorrect:**

```tsx
// Tạo Button custom trong apps/web
export function MyButton({ children, onClick }) {
  return <button className="px-4 py-2 bg-blue-500" onClick={onClick}>{children}</button>
}
```

**Correct:**

```tsx
import { Button, Card, Form, Input } from '@workspace/ui/mi'
import { AdminPageLayout, AdminPageContent, DataTable } from '@workspace/ui/mi'
import { cn } from '@workspace/ui/lib/utils'
```

Naming: components PascalCase, files kebab-case (`my-entity-form.tsx`).

