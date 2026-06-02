---
title: ApiBearerAuth on Protected Controllers
impact: HIGH
impactDescription: Swagger documents auth requirement for API consumers
tags: auth, swagger, bearer, openapi
---

## ApiBearerAuth on Protected Controllers

Controller thuộc module có `withNextAuthMiddleware` phải có `@ApiBearerAuth()` và `@ApiTags` mô tả domain.

**Incorrect (protected API không document auth):**

```typescript
@Controller("bookings")
export class BookingsController {
  @Get()
  async layTatCa() { /* ... */ }
}
```

**Correct (theo `bookings.controller.ts`):**

```typescript
@ApiTags("Bookings - Quản lý Đặt chỗ")
@ApiBearerAuth()
@Controller("bookings")
export class BookingsController {
  @Get()
  @ApiOperation({
    summary: "Lấy danh sách tất cả đặt chỗ",
    description: "Lấy danh sách tất cả đặt chỗ với thông tin relations",
  })
  @ApiResponse({ status: 200, description: "Lấy danh sách thành công" })
  async layTatCa() {
    return await this.bookingsService.layTatCa();
  }
}
```

Mỗi endpoint có `@ApiOperation` + `@ApiResponse`; param route có `@ApiParam`.

Reference: `demo/bookings/bookings.controller.ts`
