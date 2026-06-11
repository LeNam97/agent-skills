---
title: Custom Repository Class Pattern
impact: CRITICAL
impactDescription: Centralized data access, no query logic in service/controller
tags: repository, typeorm, database-service
---

## Custom Repository Class Pattern

Query phức tạp trong `@Injectable()` repository class, inject `DatabaseService`. Định nghĩa `CreateData`/`UpdateData` interfaces riêng (tránh Swagger circular reference).

**Incorrect (query trực tiếp trong service):**

```typescript
@Injectable()
export class MyEntityService {
  async findAllAndCount(query: GetListQueryBaseDto) {
    return this.db.myEntity.find({ skip: query.page * query.pageSize })
  }
}
```

**Correct (theo `.cursorrules` Section 2.1):**

```typescript
@Injectable()
export class MyEntityRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAllAndCount(query: GetListQueryBaseDto) {
    const queryBuilder = this.db.myEntity.createQueryBuilder('myEntity')
    applyListQueryFilters({
      queryBuilder,
      options: findManyOptions,
      query,
      alias: 'myEntity',
      defaultFilter: { status: [ModelStatus.ACTIVE] },
    })
    const items = await queryBuilder.getMany()
    const total = await queryBuilder.getCount()
    return { items, total, totalPages: Math.ceil(total / (query.pageSize || 10)) }
  }
}
```

File: `packages/models/src/data-access/{entity-name}.repository.ts`

