---
title: Request-Scoped Service for User Context
impact: CRITICAL
impactDescription: Safe per-request user metadata without global state
tags: nest, request-scope, auth, dependency-injection
---

## Request-Scoped Service for User Context

Khi service cần user từ request (email, tenant), dùng `Scope.REQUEST` và inject `AcRequest`.

**Incorrect (global/static user hoặc truyền email qua mọi method):**

```typescript
@Injectable()
export class BookingsService {
  async layPhanTrangChuTau(query: BookingListQueryDto, email: string) {
    const chuTau = await this.chuTauRepository.findByEmail(email, "default");
  }
}
```

**Correct (theo `demo/bookings/bookings.service.ts`):**

```typescript
@Injectable({ scope: Scope.REQUEST })
export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    @Inject(REQUEST) private readonly request: AcRequest,
  ) {}

  async layPhanTrangChuTau(query: BookingListQueryDto) {
    const email = this.request?.metadata?.getUser()?.getEmail();
    const chuTau = await this.chuTauRepository.findByEmail(email, tenant_code);
    if (!chuTau) {
      throw new NotFoundException(`Không tìm thấy chủ tàu với email: ${email}`);
    }
    // ...
  }
}
```

Reference: `demo/bookings/bookings.service.ts`
