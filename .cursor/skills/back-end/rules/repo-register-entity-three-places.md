---
title: Register Entity in Three Places
impact: CRITICAL
impactDescription: TypeORM can query, inject, and synchronize (dev)
tags: entity, registration, typeorm, database-module
---

## Register Entity in Three Places

Sau khi tạo entity mới, **PHẢI register** ở 3 nơi:

1. `database.module.ts` — `TypeOrmModule.forFeature([])`
2. `database.service.ts` — `@InjectRepository(Entity)`
3. `typeorm-config.service.ts` — `entities: []` (dev synchronize only)

**Incorrect (chỉ tạo entity file):**

```typescript
// packages/models/src/entity/my-entity.entity.ts — created
// ❌ Thiếu registration → TypeORM không query được
```

**Correct:**

```typescript
// 1. database.module.ts
TypeOrmModule.forFeature([..., MyEntity, ...])

// 2. database.service.ts
@InjectRepository(MyEntity)
public readonly myEntity: Repository<MyEntity>

// 3. typeorm-config.service.ts (dev only)
entities: [..., MyEntity, ...]
```

Export entity/repository trong `entity/index.ts` và `data-access/index.ts`.

