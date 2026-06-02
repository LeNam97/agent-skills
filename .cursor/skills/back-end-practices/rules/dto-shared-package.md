---
title: DTOs in @workspace/shared Package
impact: HIGH
impactDescription: Single source of truth for API and frontend validation
tags: dto, shared, class-validator, monorepo
---

## DTOs in @workspace/shared Package

DTO dùng chung giữa API và web đặt trong `packages/shared/src/dto/`, export qua `@workspace/shared`.

**Incorrect (DTO duplicate trong controller folder):**

```typescript
// apps/api/src/bookings/create-booking.dto.ts  ← chỉ API dùng
export class CreateBookingDto { /* ... */ }
```

**Correct (theo `packages/shared/src/dto/bookings/`):**

```typescript
// packages/shared/src/dto/bookings/bookings-core.dto.ts
export class CreateBookingsDto {
  @IsString()
  @IsNotEmpty({ message: "Mã đặt chỗ không được để trống" })
  @MaxLength(50, { message: "Mã đặt chỗ không được vượt quá 50 ký tự" })
  ma_dat_cho!: string;

  @Type(() => Number)
  @IsInt({ message: "ID tàu thuyền phải là số nguyên" })
  tau_thuyen_id!: number;
}
```

Tổ chức theo domain: `dto/auth/`, `dto/bookings/`, `dto/ticketing/`, `dto/tourism/`.

Reference: `demo/packages/shared/src/dto/bookings/bookings-core.dto.ts`, `demo/packages/shared/README.md`
