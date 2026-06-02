# Sections

## 1. NestJS Module (nest)

**Impact:** CRITICAL  
**Description:** Feature modules follow controller → service → repository layering with auth at module boundary.

## 2. Repository / DB (repo)

**Impact:** CRITICAL  
**Description:** Data access lives in injectable repository classes with TypeORM QueryBuilder.

## 3. DTO & Validation (dto)

**Impact:** HIGH  
**Description:** Shared DTOs in `@workspace/shared` with class-validator and Vietnamese messages.

## 4. API & List Query (api)

**Impact:** HIGH  
**Description:** List endpoints use `@ac/api-common` query DTOs, pagination contract, and correct route ordering.

## 5. Auth & Permissions (auth)

**Impact:** HIGH  
**Description:** NextAuth middleware on modules, bearer Swagger, static permission catalogs.

## 6. TypeORM Entity (entity)

**Impact:** MEDIUM  
**Description:** Migration-driven schema, snake_case columns, domain prefixes.

## 7. Admin UI (ui)

**Impact:** MEDIUM  
**Description:** TanStack Table/Query hooks for server-side pagination and filter state.

## 8. Monorepo (mono)

**Impact:** LOW-MEDIUM  
**Description:** Package boundaries between models, shared DTOs, UI, and permissions.
