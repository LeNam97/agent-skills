---
title: Combobox for Advanced, Select for Default Filters
impact: HIGH
impactDescription: Correct filter UX for long vs short option lists
tags: filter, combobox, select, table
---

## Combobox for Advanced, Select for Default Filters

| Position | Filter type | Use case |
|----------|-------------|----------|
| `advanced` | `combobox` | Danh sách dài, cần search (org, category) |
| `default` | `select` | Danh sách ngắn (status, type) |

Text filter: `debounceMs: 300`. Cascading: `clearOtherFilters`.

**Incorrect:**

```tsx
// Select cho advanced — không có search
columnHelper.accessor('orgUnitId', {
  meta: { filter: { type: 'select', position: 'advanced', options: filterOrgs } },
})

// Combobox cho default — over-engineering
columnHelper.accessor('status', {
  meta: { filter: { type: 'combobox', position: 'default', options: statusOptions } },
})
```

**Correct:**

```tsx
columnHelper.accessor('orgUnitId', {
  enableHiding: true,
  meta: {
    showToggle: false,
    filter: { type: 'combobox', position: 'advanced', placeholder: 'Chọn đơn vị', options: filterOrgs },
  },
})

columnHelper.accessor('status', {
  meta: {
    title: 'Trạng thái',
    filter: { type: 'select', multiple: true, position: 'default', options: statusOptions },
  },
})
```

