---
title: findAllAndCount for Paginated Lists
impact: HIGH
impactDescription: Consistent list response contract with total and totalPages
tags: api, pagination, list-query, naming
---

## findAllAndCount for Paginated Lists

List endpoint trả `{ items, total, totalPages }`. Method naming: **`findAllAndCount`** (service + repository + controller).

**Incorrect:**

```typescript
// Controller
@Get()
findAll(@Query() query: GetListQueryBaseDto) {
  return this.service.findAll(query)
}

// Repository — thiếu total
async findAll(query: GetListQueryBaseDto) {
  return this.db.myEntity.find({ take: query.pageSize })
}
```

**Correct:**

```typescript
// Controller
findAllAndCount(@Queries() @Query() query: GetListQueryBaseDto) {
  return this.myEntityService.findAllAndCount(query)
}

// Repository
async findAllAndCount(query: GetListQueryBaseDto) {
  // ... applyListQueryFilters ...
  return {
    items,
    total,
    totalPages: Math.ceil(total / (query.pageSize || 10)),
  }
}
```

`findAll` (no count) chỉ cho catalog `/all` endpoints.
