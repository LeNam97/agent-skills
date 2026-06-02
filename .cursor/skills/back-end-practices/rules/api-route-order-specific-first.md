---
title: Specific Routes Before Param Routes
impact: HIGH
impactDescription: Prevents static paths being captured by :id
tags: api, routing, nest, express
---

## Specific Routes Before Param Routes

Route tĩnh/cụ thể (`phan-trang`, `theo-tau/:tau_id`) khai báo **trước** `@Get(":id")`.

**Incorrect (`:id` nuốt "phan-trang"):**

```typescript
@Get(":id")
async layTheoId(@Param("id") id: string) { /* ... */ }

@Get("phan-trang")
async layPhanTrang(@Query() query: BookingListQueryDto) { /* ... */ }
```

**Correct (theo `bookings.controller.ts`):**

```typescript
@Get()
async layTatCa() { /* ... */ }

@Get("phan-trang")
async layPhanTrang(@Queries() @Query() query: BookingListQueryDto) { /* ... */ }

@Get("theo-tau/:tau_id")
async layTheoTau(@Param("tau_id") tau_id: string) { /* ... */ }

@Get(":id")
async layTheoId(@Param("id") id: string) { /* ... */ }
```

Reference: `demo/bookings/bookings.controller.ts`
