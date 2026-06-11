---
title: Extend AcBaseEntity for Audit Fields
impact: MEDIUM
impactDescription: Automatic createdBy, updatedBy, timestamps on all entities
tags: entity, audit, ac-base-entity, typeorm
---

## Extend AcBaseEntity for Audit Fields

Mọi entity **PHẢI extend `AcBaseEntity`** để có `createdAt`, `updatedAt`, `createdById`, `updatedById`, relations `createdBy`, `updatedBy`.

**Incorrect:**

```typescript
@Entity('my_entities')
export class MyEntity {
  @PrimaryColumn(DB_TYPE.UUID, DB_TYPE.getUuidGenerate())
  id!: string

  @Column(DB_TYPE.VARCHAR)
  name!: string

  @CreateDateColumn()
  createdAt!: Date
}
```

**Correct:**

```typescript
@Entity('my_entities')
export class MyEntity extends AcBaseEntity {
  @PrimaryColumn(DB_TYPE.UUID, DB_TYPE.getUuidGenerate())
  id!: string

  @Column(DB_TYPE.VARCHAR, { comment: 'Tên thực thể' })
  name!: string
}
```

Chỉ dùng `BaseTimestampEntity` khi không cần audit user. Tránh entity không base class.

