---
title: snake_case Columns with Domain Prefixes
impact: MEDIUM
impactDescription: Aligns TypeORM entities with PostgreSQL naming and domain language
tags: entity, naming, snake-case, typeorm
---

## snake_case Columns with Domain Prefixes

Cột entity dùng snake_case tiếng Việt/ASCII, prefix theo nhóm field (`th_` tổng hợp, `tt_` thông tin tàu, `ht_` hành trình). Enum string union khớp DB.

**Incorrect (camelCase DB columns, English-only status):**

```typescript
@Entity("bookings")
export class Booking {
  @Column()
  shipId: number;

  @Column()
  status: string; // "PENDING" | "CONFIRMED"
}
```

**Correct (theo `bookings.entity.ts` + `types/booking.ts`):**

```typescript
export enum BookingTrangThai {
  BAN_NHAP = "ban_nhap",
  CHO_DUYET = "cho_duyet",
  DA_DUYET = "da_duyet",
  BI_TU_CHOI = "bi_tu_choi",
}

@Entity("bookings")
export class Bookings {
  @Column({ name: "tau_thuyen_id" })
  tau_thuyen_id!: string;

  @Column({ name: "trang_thai", type: "varchar" })
  trang_thai!: BookingTrangThai;

  @Column({ name: "tenant_code", default: "default" })
  tenant_code!: string;

  @Column({ name: "th_tong_so_khach", nullable: true })
  th_tong_so_khach?: number;
}
```

DTO trong `@workspace/shared` phải dùng cùng enum/status values, không mix English legacy (`PENDING`).

Reference: `demo/packages/api-models/src/entity/bookings.entity.ts`, `demo/packages/api-models/src/types/booking.ts`
