# Sections

## 1. NestJS Module (nest)

**Impact:** CRITICAL  
**Description:** Feature modules follow controller → service → repository layering with AcRequest user context and NextAuthMiddleware at module boundary.

## 2. Repository / DB (repo)

**Impact:** CRITICAL  
**Description:** Data access in injectable repository classes via DatabaseService, applyListQueryFilters (auto-load theo description: filter, bộ lọc, phân trang), soft delete, keyword generation.

## 3. DTO & Validation (dto)

**Impact:** HIGH  
**Description:** DTOs in apps/api feature folders with class-validator, trimString transforms, Vietnamese messages.

## 4. API & List Query (api)

**Impact:** HIGH  
**Description:** List endpoints use GetListQueryBaseDto, findAllAndCount naming, @Route/@Queries Swagger.

## 5. Auth & User Context (auth)

**Impact:** HIGH  
**Description:** AcRequest injection in service; NextAuthMiddleware on module routes.

## 6. TypeORM Entity (entity)

**Impact:** MEDIUM  
**Description:** AcBaseEntity, plural table names, Vietnamese column comments, DB_TYPE cross-database helpers.

## 7. Monorepo (mono)

**Impact:** LOW-MEDIUM  
**Description:** Package boundaries between @ac/models, @ac/common, @ac/be, apps/api.
