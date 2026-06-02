---
title: Custom Repository Class for Queries
impact: CRITICAL
impactDescription: Keeps services thin and queries reusable
tags: repository, typeorm, data-access
---

## Custom Repository Class for Queries

Query phức tạp (join, filter, pagination) đặt trong `@Injectable()` repository class trong `@ac/models`, không inline trong service.

**Incorrect (QueryBuilder trực tiếp trong service):**

```typescript
@Injectable()
export class BookingsService {
  async layPhanTrang(query: BookingListQueryDto) {
    const qb = this.repo.createQueryBuilder("bookings")
      .leftJoin("bookings.tau_thuyen", "tau_thuyen")
      .where(/* ... 50 lines ... */);
    return qb.getMany();
  }
}
```

**Correct (theo `demo/packages/api-models/src/data-access/bookings.repository.ts`):**

```typescript
// bookings.repository.ts
@Injectable()
export class BookingsRepository {
  constructor(
    @InjectRepository(Bookings)
    private readonly bookingsRepo: Repository<Bookings>,
  ) {}

  async findWithPagination(query: BookingListQueryDto) {
    const queryBuilder = this.bookingsRepo.createQueryBuilder("bookings");
    // joins, filters, applyListQueryFilters...
    return { items, total, page, pageSize };
  }
}

// bookings.service.ts
async layPhanTrang(query: BookingListQueryDto) {
  return await this.bookingsRepository.findWithPagination(query);
}
```

Đăng ký repository trong `DatabaseModule` providers.

Reference: `demo/packages/api-models/src/data-access/bookings.repository.ts`
