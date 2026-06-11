---
title: Thin Controller — Logic in Service
impact: CRITICAL
impactDescription: Maintainable feature modules, testable business logic
tags: nest, controller, service, layering
---

## Thin Controller — Logic in Service

Controller chỉ: định tuyến HTTP, bind query/param/body, gọi service, trả response. Swagger metadata đặt ở controller.

**Incorrect (business logic + DB trong controller):**

```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  const item = await this.db.myEntity.findOne({ where: { id } })
  if (!item) throw new BadRequestException('Không tìm thấy bản ghi')
  item.orgUnit = await this.db.orgUnit.findOne({ where: { id: item.orgUnitId } })
  return item
}
```

**Correct (theo `.cursorrules` Section 2.4):**

```typescript
@Get(':id')
@ApiOperation({ summary: 'Lấy chi tiết' })
findOne(@Param('id') id: string) {
  return this.myEntityService.findOne(id)
}
```

Service xử lý orchestration, enrich data, throw exception. Repository xử lý query.

