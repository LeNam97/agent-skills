---
title: No User Params from Controller
impact: HIGH
impactDescription: Single source of truth for auth context in service layer
tags: auth, acrequest, controller, anti-pattern
---

## No User Params from Controller

Không dùng `@CurrentUser()`, không truyền `userId`/`orgUnitId` qua method params. Service tự đọc từ `AcRequest`.

**Incorrect:**

```typescript
@Patch(':id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateDto,
  @CurrentUser('id') userId: string
) {
  return this.service.update(id, dto, userId)
}
```

**Correct:**

```typescript
@Patch(':id')
@ApiOperation({ summary: 'Cập nhật' })
update(@Param('id') id: string, @Body() updateDto: UpdateMyEntityDto) {
  return this.myEntityService.update(id, updateDto)
}

// Service
async update(id: string, updateDto: UpdateMyEntityDto) {
  const userId = this.request.metadata.getUser().getId()
  return this.myEntityRepository.update(id, { ...updateDto, updatedById: userId })
}
```

Điều kiện: module đã register `NextAuthMiddleware`.

