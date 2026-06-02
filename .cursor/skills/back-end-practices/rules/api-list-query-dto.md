---
title: List Endpoints Use BookingListQueryDto
impact: HIGH
impactDescription: Consistent filter, sort, keyword, pagination across modules
tags: api, pagination, list-query, api-common
---

## List Endpoints Use BookingListQueryDto

Endpoint phân trang dùng DTO từ `@ac/api-common`, decorator `@Queries()`, và `applyListQueryFilters` trong repository.

**Incorrect (raw query params, logic filter rải rác):**

```typescript
@Get("phan-trang")
async layPhanTrang(
  @Query("page") page: string,
  @Query("size") size: string,
  @Query("keyword") keyword?: string,
) {
  return this.service.findPage(Number(page), Number(size), keyword);
}
```

**Correct (theo `bookings.controller.ts` + `bookings.repository.ts`):**

```typescript
// Controller
@Get("phan-trang")
@ApiOperation({ summary: "Lấy danh sách đặt chỗ có phân trang" })
async layPhanTrang(@Queries() @Query() query: BookingListQueryDto) {
  return await this.bookingsService.layPhanTrang(query);
}

// Repository
const findManyOptions: GetListQueryHelperOptions<Bookings> = {
  filterKeywordType: "contains",
  filterKeywordColumns: ["ma_dat_cho", "nguoi_tao"],
  filterColumns: [{ columnName: "trang_thai", type: "string" }],
};

applyListQueryFilters(queryBuilder, query, findManyOptions);
// Return: { items, total, page, pageSize }
```

Reference: `demo/bookings/bookings.controller.ts`, `demo/packages/api-models/src/data-access/bookings.repository.ts`
