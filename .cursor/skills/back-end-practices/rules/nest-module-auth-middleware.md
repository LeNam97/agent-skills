---
title: Wrap Module with withNextAuthMiddleware
impact: CRITICAL
impactDescription: Consistent auth gating per feature module
tags: nest, auth, module, middleware
---

## Wrap Module with withNextAuthMiddleware

Auth áp dụng ở **module boundary**, không lặp guard trên từng route.

**Incorrect (guard lặp trên mọi route):**

```typescript
@Module({
  controllers: [BookingsController],
  providers: [BookingsService, AuthGuard],
})
export class BookingsModule {}
```

**Correct (theo `demo/bookings/bookings.module.ts`):**

```typescript
@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([BookingHanhKhach, BookingHanhKhachDraft])],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
class _BookingsModule {}

export const BookingsModule = withNextAuthMiddleware(_BookingsModule, "bookings");
```

Controller kèm `@ApiBearerAuth()` cho Swagger. Middleware từ `src/core` (parent app).

Reference: `demo/bookings/bookings.module.ts`
