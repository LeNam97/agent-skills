---
title: NotFoundException with Vietnamese Message
impact: HIGH
impactDescription: Consistent 404 responses for missing domain entities
tags: api, error, nest, not-found
---

## NotFoundException with Vietnamese Message

Khi entity không tồn tại, throw `NotFoundException` với message mô tả rõ (tiếng Việt), khai báo `@ApiResponse({ status: 404 })` trên Swagger.

**Incorrect (trả null/undefined hoặc 200 với body rỗng):**

```typescript
async layTheoId(id: string) {
  const result = await this.bookingsRepository.findById(id);
  return result; // null → client không biết 404
}
```

**Correct (theo `bookings.service.ts`):**

```typescript
// Service
async layTheoId(id: string) {
  const result = await this.bookingsRepository.findById(id);
  if (!result) {
    throw new NotFoundException(`Không tìm thấy đặt chỗ với ID: ${id}`);
  }
  return result;
}

// Controller
@Get(":id")
@ApiResponse({ status: 200, description: "Lấy thông tin thành công" })
@ApiResponse({ status: 404, description: "Không tìm thấy đặt chỗ" })
async layTheoId(@Param("id") id: string) {
  return await this.bookingsService.layTheoId(id);
}
```

Reference: `demo/bookings/bookings.service.ts`, `demo/bookings/bookings.controller.ts`
