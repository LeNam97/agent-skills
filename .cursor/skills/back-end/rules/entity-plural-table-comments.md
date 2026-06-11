---
title: Plural Table Names and Column Comments
impact: MEDIUM
impactDescription: Consistent schema naming and documentation
tags: entity, naming, comments, table
---

## Plural Table Names and Column Comments

- Table name **plural snake_case**: `'my_entities'`, `'staff_members'`
- **Không** singular: `'user'`, `'my_entity'`
- **Không** camelCase table name: `'userProfiles'`
- Mọi `@Column` **PHẢI có `comment`** tiếng Việt

**Incorrect:**

```typescript
@Entity('my_entity')
export class MyEntity extends AcBaseEntity {
  @Column(DB_TYPE.VARCHAR)
  name!: string

  @Column(DB_TYPE.NUMBER, { default: 1 })
  status!: number
}
```

**Correct:**

```typescript
@Entity('my_entities')
export class MyEntity extends AcBaseEntity {
  @Column(DB_TYPE.VARCHAR, { unique: true, comment: 'Tên thực thể' })
  name!: string

  @Column(DB_TYPE.NUMBER, { default: 1, comment: 'Trạng thái: 1=Hoạt động, 0=Không hoạt động' })
  status!: number

  @Column(DB_TYPE.VARCHAR, { nullable: true, comment: 'Từ khóa tìm kiếm' })
  keyword?: string
}
```

