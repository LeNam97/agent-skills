---
title: Column Order and columnHelper Placement
impact: HIGH
impactDescription: Consistent table UX and render performance
tags: list, columns, tanstack-table
---

## Column Order and columnHelper Placement

- `createColumnHelper<Entity>()` **ngoài component**
- Column order: **STT** → **Actions** → hidden filter columns → visible columns
- Filter-only columns: `enableHiding: true`, `meta.showToggle: false`
- Visible columns: luôn có `meta.title`

**Incorrect:**

```tsx
export function ListPage() {
  const columnHelper = createColumnHelper<MyEntity>()
  const columns = [
    columnHelper.accessor('name', { header: 'Tên' }),
    columnHelper.display({ id: 'actions', header: '' }),
  ]
}
```

**Correct:**

```tsx
const columnHelper = createColumnHelper<MyEntity>()

export function MyEntityListPage() {
  const columns = [
    columnHelper.display({ id: 'stt', header: 'STT', size: 50, ... }),
    columnHelper.display({ id: 'actions', header: '', size: 50, ... }),
    columnHelper.accessor('code', { enableHiding: true, meta: { showToggle: false, filter: {...} } }),
    columnHelper.accessor('name', { header: 'Tên', meta: { title: 'Tên', filter: {...} } }),
  ] as ColumnDef<MyEntity>[]
}
```

Dùng `useMemo` cho columns nếu phụ thuộc dynamic options.

