---
title: Batch Fetch with In() — Not Loop Queries
impact: CRITICAL
impactDescription: Prevents N+1 when enriching list results
tags: repository, n-plus-one, performance, typeorm
---

## Batch Fetch with In() — Not Loop Queries

Khi enrich danh sách (vd. hành khách theo booking), gom ID và query một lần với `In()`.

**Incorrect (query trong loop):**

```typescript
const items = [];
for (const booking of result.items) {
  const hanhKhach = await this.hanhKhachRepo.find({
    where: { booking_id: booking.id },
  });
  items.push({ ...booking, hanh_khach: hanhKhach });
}
```

**Correct (theo `bookings.service.ts` `layPhanTrangChuTau`):**

```typescript
const banNhapIds = result.items
  .filter((b) => b.trang_thai === BookingTrangThai.BAN_NHAP)
  .map((b) => b.id);
const otherIds = result.items
  .filter((b) => b.trang_thai !== BookingTrangThai.BAN_NHAP)
  .map((b) => b.id);

const hanhKhachByBookingId = new Map<string, unknown[]>();

if (banNhapIds.length > 0) {
  const draftList = await this.hanhKhachDraftRepo.find({
    where: { booking_id: In(banNhapIds), trang_thai: TrangThaiHoatDong.HOAT_DONG },
    order: { ngay_tao: "ASC" },
  });
  for (const d of draftList) {
    const list = hanhKhachByBookingId.get(d.booking_id) ?? [];
    list.push(d);
    hanhKhachByBookingId.set(d.booking_id, list);
  }
}

const items = result.items.map((booking) => ({
  ...booking,
  hanh_khach: hanhKhachByBookingId.get(booking.id) ?? [],
}));
```

Tách draft vs committed passengers theo `BookingTrangThai`.

Reference: `demo/bookings/bookings.service.ts`
