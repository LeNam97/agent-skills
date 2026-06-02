---
title: Server-Side Pagination with use-table
impact: MEDIUM
impactDescription: Admin tables sync page/filter/sort with backend list API
tags: ui, tanstack, pagination, react-query
---

## Server-Side Pagination with use-table

Admin list dùng `use-table` hook: TanStack Table **manual pagination**, React Query fetch, state qua `tableStateUtils`.

**Incorrect (client-side pagination trên full dataset lớn):**

```typescript
const table = useReactTable({
  data: allBookings, // fetch all
  getPaginationRowModel: getPaginationRowModel(),
});
```

**Correct (theo `packages/ui/src/hooks/use-table.ts`):**

```typescript
// Backend contract
// { items: Bookings[], total: number, page: number, pageSize: number }

const table = useReactTable({
  data: queryData?.items ?? [],
  manualPagination: true,
  pageCount: Math.ceil((queryData?.total ?? 0) / pageSize),
  state: { pagination: { pageIndex: page - 1, pageSize } },
  meta: { total: queryData?.total },
});

// TableState: page, pageSize, sortBy, sortDir, filter[id], keyword
// serializeTableState / deserializeTableState for URL or localStorage
```

Filter format: `filter[trang_thai]`, `filter[tu_ngay]` — khớp `BookingListQueryDto.filter` backend.

Reference: `demo/packages/ui/src/hooks/use-table.ts`, `demo/packages/ui/src/lib/tableStateUtils.ts`
