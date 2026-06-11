---
title: Register NextAuthMiddleware on Module
impact: CRITICAL
impactDescription: request.metadata.getUser() works in service
tags: nest, auth, middleware, module
---

## Register NextAuthMiddleware on Module

Module **PHẢI register `NextAuthMiddleware`** trong `configure()` để `AcRequest.metadata.getUser()` có dữ liệu user.

**Incorrect (thiếu middleware — getUser() trả undefined):**

```typescript
@Module({
  imports: [DatabaseModule],
  controllers: [MyEntityController],
  providers: [MyEntityService, MyEntityRepository],
})
export class MyEntityModule {}
```

**Correct (theo `.cursorrules` Section 2.5):**

```typescript
@Module({
  imports: [DatabaseModule],
  controllers: [MyEntityController],
  providers: [MyEntityService, MyEntityRepository],
  exports: [MyEntityService],
})
export class MyEntityModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(NextAuthMiddleware).forRoutes('my-entity')
  }
}
```

Route trong `forRoutes()` phải khớp với `@Controller('my-entity')`.

