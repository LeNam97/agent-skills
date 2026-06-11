---
title: applyListQueryFilters — Filter danh sách dùng chung
description: >-
  Kích hoạt khi task/description đề cập filter danh sách, bộ lọc, phân trang,
  list query, applyListQueryFilters, SearchDto, ListQueryDto,
  findPaginated, findAllAndCount, keyword search, tu_ngay, den_ngay, trang_thai filter,
  repository filter, thống kê theo filter, data-access filter. Một hàm filter duy nhất
  từ @ac/api-common — không file config riêng, không wrapper, không private applyListQueryFilters.
impact: CRITICAL
impactDescription: Một hàm filter duy nhất — preset nội bộ trong @ac/api-common
tags: repository, list-query, filter, pagination, api-common, auto-load
---

## applyListQueryFilters — hàm filter duy nhất

Mọi repository phân trang gọi **một** hàm từ `@ac/api-common`:

```typescript
import { applyListQueryFilters, type ListQueryFilterConfig } from "@ac/api-common";
```

`config` (`ListQueryFilterConfig`) do **repository** khai báo theo spec — **không** preset trong `@ac/api-common`, **không** file `*-list-filter.config.ts` riêng.

**Không** tạo wrapper (`applyBookingListFilters`, `private applyListQueryFilters`, v.v.).

### Cấu trúc query từ client

DTO phân trang (`*ListQueryDto`) gửi field **snake_case** phẳng:

| Field | Mô tả |
| ----- | ----- |
| `page`, `pageSize` | Phân trang (xử lý ngoài hàm filter) |
| `keyword` | Tìm chung — ILIKE `ma_dat_cho`, `nguoi_tao` |
| `trang_thai` | `eq` hoặc `IN` (multi-select) |
| `tau_thuyen_id` | UUID exact |
| `tu_ngay` / `den_ngay` | Range trên `ngay_di` |
| `ht_ma_hanh_trinh` | PostgreSQL array overlap `&&` |

Alias QueryBuilder: `booking` (khớp `dbColumn` trong config).

### Gọi trong repository

```typescript
const listFilterConfig: ListQueryFilterConfig = {
  keyword: { columns: ["booking.ma_dat_cho", "booking.nguoi_tao"] },
  columns: [
    { paramKey: "trang_thai", dbColumn: "booking.trang_thai", compare: "in" },
    // ... map từ spec Repository filter
  ],
};

// Cơ bản
applyListQueryFilters(qb, params, listFilterConfig);

// Scope / soft-delete
this.joinTauThuyen(qb);
applyListQueryFilters(qb, params, listFilterConfig, {
  excludeDeleted: { column: "booking.trang_thai", value: BookingTrangThai.DA_XOA },
  actorScope: { paramKey: "chu_tau_email", dbColumn: "tau_thuyen.email" },
});
```

### Options tùy chọn (tham số thứ 4)

| Option | Dùng khi |
| ------ | -------- |
| `excludeDeleted` | Loại bản ghi đã xoá (`unlessParam: 'include_deleted'`) |
| `actorScope` | Scope theo actor (chủ tàu qua email) |
| `before` | Logic đặc biệt (subquery, join con) — hiếm khi cần |

### Quy tắc nhanh

1. **Một hàm** — `applyListQueryFilters(qb, params, config, options?)` cho list + thống kê.
2. Join relation trước apply khi cần `actorScope`; selective `addSelect`.
3. Scope actor set ở service từ `AcRequest`, không truyền từ controller.
4. `/thong-ke` dùng cùng hàm + options (không phân trang).

**Incorrect:**

```typescript
// ❌ file config riêng per module
export const TAU_THUYEN_LIST_FILTER_CONFIG = { ... };

// ❌ private method copy-paste
private applyListQueryFilters(qb, params) {
  if (params.keyword) qb.andWhere(...);
}
```

**Correct:**

```typescript
import { applyListQueryFilters } from "@ac/api-common";

applyListQueryFilters(qb, params, listFilterConfig);
applyListQueryFilters(qb, params, listFilterConfig, { excludeDeleted: { ... } });
```

Tham khảo: `packages/api-common/src/list-query/apply-list-query-filters.ts`, `tau-thuyen.repository.ts`.
