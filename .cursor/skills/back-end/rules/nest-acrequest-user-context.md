---
title: AcRequest User Context in Service
impact: CRITICAL
impactDescription: Consistent user/audit field population across all features
tags: nest, service, acrequest, auth, audit
---

## AcRequest User Context in Service

Service **PHẢI inject `AcRequest`** qua `@Inject(REQUEST)` để lấy userId, orgUnitId. Không truyền user info từ controller.

**Incorrect (truyền userId từ controller):**

```typescript
@Post()
create(@Body() dto: CreateDto, @CurrentUser('id') userId: string) {
  return this.service.create(dto, userId)
}

@Injectable()
export class MyEntityService {
  async create(dto: CreateDto, userId: string) {
    return this.repo.create({ ...dto, createdById: userId })
  }
}
```

**Correct (theo `.cursorrules` Section 2.3):**

```typescript
@Post()
create(@Body() createDto: CreateMyEntityDto) {
  return this.myEntityService.create(createDto)
}

@Injectable()
export class MyEntityService {
  constructor(
    @Inject(REQUEST) private readonly request: AcRequest,
    private readonly myEntityRepository: MyEntityRepository
  ) {}

  async create(createDto: CreateMyEntityDto) {
    const userId = this.request.metadata.getUser().getId()
    return this.myEntityRepository.create({
      ...createDto,
      createdById: userId,
    })
  }
}
```

