---
title: Selective QueryBuilder Joins
impact: CRITICAL
impactDescription: Avoids over-fetching relations and large payloads
tags: repository, query-builder, performance, typeorm
---

## Selective QueryBuilder Joins

Dùng `leftJoin` + `addSelect([...columns])` thay vì `relations: [...]` khi chỉ cần subset cột relation.

**Incorrect (load full relation entities):**

```typescript
return this.bookingsRepo.find({
  where: { id },
  relations: ["tau_thuyen", "nhan_vien_xu_ly_info", "booking_file_dinh_kem"],
});
```

**Correct (theo `bookings.repository.ts` `findById`):**

```typescript
const queryBuilder = this.bookingsRepo.createQueryBuilder("bookings");

queryBuilder
  .leftJoin("bookings.tau_thuyen", "tau_thuyen")
  .addSelect([
    "tau_thuyen.id",
    "tau_thuyen.ten_tau",
    "tau_thuyen.ma_tau",
    "tau_thuyen.suc_chua_toi_da",
  ])
  .leftJoin("bookings.nhan_vien_xu_ly_info", "nhan_vien_xu_ly_info")
  .addSelect([
    "nhan_vien_xu_ly_info.id",
    "nhan_vien_xu_ly_info.ten_dang_nhap",
    "nhan_vien_xu_ly_info.email",
  ])
  .where("bookings.id = :id", { id });

return queryBuilder.getOne();
```

Reference: `demo/packages/api-models/src/data-access/bookings.repository.ts`
