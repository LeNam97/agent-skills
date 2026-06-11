---
title: Controller Route and Swagger Pattern
impact: HIGH
impactDescription: Consistent API docs and list endpoint naming
tags: nest, controller, swagger, route, tsoa
---

## Controller Route and Swagger Pattern

- Dùng `@Route()` từ `@ac/common` + `@Controller()` cùng path
- List endpoint: method `findAllAndCount`, không `findAll`
- Query params: `@Queries()` từ `tsoa` + `@Query()` từ NestJS
- Mọi method có `@ApiOperation`

**Incorrect:**

```typescript
@Controller('my-entity')
export class MyEntityController {
  @Get()
  findAll(@Query() query: GetListQueryBaseDto) {
    return this.service.findAll(query)
  }
}
```

**Correct (theo `.cursorrules` Section 2.4):**

```typescript
@Route('my-entity')
@Controller('my-entity')
export class MyEntityController {
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách' })
  findAllAndCount(@Queries() @Query() query: GetListQueryBaseDto) {
    return this.myEntityService.findAllAndCount(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết' })
  findOne(@Param('id') id: string) {
    return this.myEntityService.findOne(id)
  }
}
```

`findAll` chỉ dùng cho catalog endpoint `/method/all` (tỉnh, huyện, xã...).

