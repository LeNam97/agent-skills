---
title: Soft Delete and Keyword Generation
impact: HIGH
impactDescription: Searchable entities with safe deletion
tags: repository, soft-delete, keyword, search
---

## Soft Delete and Keyword Generation

- Xóa mềm: `status = ModelStatus.DELETED`, không hard delete
- Entity searchable: field `keyword` + `generateKeywordFromObject` on create/update
- Regenerate keyword sau mỗi update

**Incorrect:**

```typescript
async remove(id: string) {
  return this.db.myEntity.delete(id)
}

create(data: CreateData) {
  return this.db.myEntity.save(data)
}
```

**Correct:**

```typescript
private static searchColumns = ['name', 'code', 'description']

create(createDto: CreateMyEntityData) {
  return this.db.myEntity.save({
    ...createDto,
    keyword: generateKeywordFromObject(createDto, MyEntityRepository.searchColumns),
  })
}

async update(id: string, updateDto: UpdateMyEntityData) {
  await this.db.myEntity.update(id, updateDto)
  await this.updateKeyword(id)
  return this.findById(id, { throwError: true })
}

async remove(id: string) {
  return this.db.myEntity.update(id, { status: ModelStatus.DELETED })
}
```

