---
title: synchronize false — Migrations Only
impact: MEDIUM
impactDescription: Prevents accidental schema drift in production
tags: entity, typeorm, migrations, database
---

## synchronize false — Migrations Only

Không bật `synchronize: true` trên production. Schema thay đổi qua migration CLI.

**Incorrect:**

```typescript
TypeOrmModule.forRoot({
  type: "postgres",
  url: process.env.DB_URL,
  synchronize: true, // tự động alter schema — nguy hiểm
  entities: [Bookings],
});
```

**Correct (theo `typeorm-config.service.ts` pattern):**

```typescript
return {
  type: "postgres",
  url: configService.get("DB_URL"),
  synchronize: false,
  migrations: ["dist/migrations/*.js"],
  migrationsTableName: "migrations",
  entities: [/* registered entities */],
};
```

Standalone CLI: `data-source.main.ts` cho `typeorm migration:run`.

Reference: `demo/packages/api-models/src/typeorm-config.service.ts`, `demo/packages/api-models/src/data-source.main.ts`
