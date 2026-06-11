---
title: trimString Transform on DTO Fields
impact: HIGH
impactDescription: Prevent whitespace-only values reaching database
tags: dto, transform, trim, validation
---

## trimString Transform on DTO Fields

String fields **PHẢI** dùng `@Transform(trimString())` (required) hoặc `@Transform(trimStringOptional())` (optional) từ `@ac/be`. Đặt `@Transform` trước validation decorators.

**Incorrect:**

```typescript
@ApiProperty({ description: 'Tên thực thể' })
@IsString()
@IsNotEmpty({ message: 'Tên không được để trống' })
name!: string
```

**Correct:**

```typescript
import { trimString, trimStringOptional } from '@ac/be'
import { Transform } from 'class-transformer'

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

