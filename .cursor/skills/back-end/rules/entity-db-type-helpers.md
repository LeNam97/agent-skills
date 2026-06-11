---
title: DB_TYPE Helpers for Cross-Database
impact: MEDIUM
impactDescription: Oracle production + PostgreSQL local dev compatibility
tags: entity, db-type, oracle, postgres
---

## DB_TYPE Helpers for Cross-Database

Dùng `DB_TYPE` từ `db.fn` cho mọi column. Không dùng boolean (Oracle 19c). JSON dùng `jsonTransformer`.

**Incorrect:**

```typescript
@PrimaryGeneratedColumn('uuid')
id!: string

@Column({ type: 'boolean', default: true })
isActive!: boolean

@Column('jsonb')
metadata!: Record<string, unknown>
```

**Correct:**

```typescript
@PrimaryColumn(DB_TYPE.UUID, DB_TYPE.getUuidGenerate())
id!: string

@Column(DB_TYPE.NUMBER, { default: 1, comment: 'Trạng thái: 1=Hoạt động, 0=Không hoạt động' })
status!: number

@Column(DB_TYPE.UUID, { ...DB_TYPE.getUuidRelation(), comment: 'ID đơn vị' })
orgUnitId!: string

@Column(DB_TYPE.TEXT, { nullable: true, comment: 'Nội dung dài >= 4000 ký tự' })
content?: string
```

VARCHAR cho < 4000 chars; TEXT cho >= 4000 hoặc unlimited.

