---
title: Thin Controller — Logic in Service
impact: CRITICAL
impactDescription: Maintainable feature modules, testable business logic
tags: nest, controller, service, layering
---

## Thin Controller — Logic in Service

Controller chỉ: định tuyến HTTP, bind query/param, gọi service, trả response. Swagger metadata đặt ở controller.

**Incorrect (business logic + DB trong controller):**

```typescript
@Get(":id")
async layTheoId(@Param("id") id: string) {
  const booking = await this.repo.findOne({ where: { id } });
  if (!booking) throw new NotFoundException("Not found");
  const passengers = await this.hanhKhachRepo.find({ where: { booking_id: id } });
  return { ...booking, hanh_khach: passengers };
}
```

**Correct (theo `demo/bookings/bookings.controller.ts`):**

```typescript
@Get(":id")
@ApiOperation({ summary: "Lấy đặt chỗ theo ID" })
@ApiResponse({ status: 404, description: "Không tìm thấy đặt chỗ" })
async layTheoId(@Param("id") id: string) {
  return await this.bookingsService.layTheoId(id);
}
```

Service (`bookings.service.ts`) xử lý orchestration, enrich data, throw `NotFoundException`.

Reference: `demo/bookings/bookings.controller.ts`, `demo/bookings/bookings.service.ts`
