---
title: Vietnamese Validation Messages
impact: HIGH
impactDescription: Consistent UX for Vietnamese domain users
tags: dto, validation, i18n, class-validator
---

## Vietnamese Validation Messages

Message `class-validator` bằng tiếng Việt. `@ApiProperty`/`@ApiPropertyOptional` có `description` và `example` tiếng Việt. Enum values documented in description.

**Incorrect:**

```typescript
@IsString()
@IsNotEmpty()
name!: string

@IsEnum(ProcessStatus)
status?: ProcessStatus
```

**Correct:**

```typescript
@ApiProperty({
  description: 'Tên thực thể',
  example: 'Thực thể A',
})
@Transform(trimString())
@IsString()
@MaxLength(255)
@IsNotEmpty({ message: 'Tên không được để trống' })
name!: string

@ApiPropertyOptional({
  example: ProcessStatus.ACTIVE,
  enum: ProcessStatus,
  description: 'Trạng thái: 1=Hoạt động, 0=Không hoạt động',
})
@IsEnum(ProcessStatus)
@IsOptional()
status?: ProcessStatus
```

UUID FK: `@IsOracleUUID()` từ `@ac/common`.

