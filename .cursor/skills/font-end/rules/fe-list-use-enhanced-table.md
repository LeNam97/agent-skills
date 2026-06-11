---
title: useEnhancedTable for List Pages
impact: CRITICAL
impactDescription: Server-side pagination, filtering, sorting with React Query
tags: list, table, tanstack, useEnhancedTable
---

## useEnhancedTable for List Pages

List page dùng `useEnhancedTable` + `generateQueryParams`. Truyền API function vào `queryFn`, không fetch thủ công.

**Incorrect:**

```tsx
const [data, setData] = useState([])
useEffect(() => {
  fetch('/ac-apis/my-entity').then(r => r.json()).then(setData)
}, [])
return <table>{data.map(...)}</table>
```

**Correct:**

```tsx
const { table } = useEnhancedTable<MyEntity>({
  columns,
  pageName: 'my-entity',
  queryFn: async state => {
    const params = generateQueryParams(state, { columns, baseParams: {} })
    return getListMyEntity({ params })
  },
  onFilterChange: setFilter,
  initialState: {
    columnVisibility: { code: false, orgUnitId: false },
    sorting: [{ id: 'createdAt', desc: true }],
  },
  enabled: true,
  queryKey: ['my-entity'],
})

return <DataTable table={table} />
```

