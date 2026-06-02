---
title: Vietnamese Validation Messages
impact: HIGH
impactDescription: Consistent UX for Vietnamese domain users
tags: dto, validation, i18n, class-validator
---

## Vietnamese Validation Messages

Message `class-validator` bằng tiếng Việt, mô tả rõ field domain.

**Incorrect (message tiếng Anh mặc định hoặc không có message):**

```typescript
@IsString()
@IsNotEmpty()
ma_dat_cho!: string;

@IsDateString()
ngay_di!: string;
```

**Correct (theo `bookings-core.dto.ts`):**

```typescript
@IsString()
@IsNotEmpty({ message: "Mã đặt chỗ không được để trống" })
@MaxLength(50, { message: "Mã đặt chỗ không được vượt quá 50 ký tự" })
ma_dat_cho!: string;

@IsDateString({}, { message: "Ngày đi phải là định dạng date hợp lệ" })
ngay_di!: string;

@Type(() => Number)
@IsInt({ message: "ID tàu thuyền phải là số nguyên" })
@IsPositive({ message: "ID tàu thuyền phải là số dương" })
tau_thuyen_id!: number;
```

Enum/status dùng snake_case tiếng Việt: `ban_nhap`, `cho_duyet`, `da_duyet`.

Reference: `demo/packages/shared/src/dto/bookings/bookings-core.dto.ts`
