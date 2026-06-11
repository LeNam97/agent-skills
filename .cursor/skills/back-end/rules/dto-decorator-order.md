---
title: DTO Decorator Order
impact: HIGH
impactDescription: Predictable validation pipeline and Swagger generation
tags: dto, decorators, swagger, validation
---

## DTO Decorator Order

Thứ tự decorator: **Swagger → Transform → Validation → Optional**

**Incorrect:**

```typescript
@IsString()
@IsNotEmpty({ message: 'Tên không được để trống' })
@ApiProperty({ description: 'Tên' })
@Transform(trimString())
name!: string
```

**Correct:**

```typescript
@ApiProperty({ description: 'Tên thực thể', example: 'Thực thể A' })
@Transform(trimString())
@IsString()
@MaxLength(255)
@IsNotEmpty({ message: 'Tên không được để trống' })
name!: string

@ApiPropertyOptional({ description: 'Mô tả' })
@Transform(trimStringOptional())
@IsString()
@MaxLength(4000)
@IsOptional()
description?: string
```

Required fields: `!` suffix. Optional fields: `?` suffix + `@IsOptional()`.

