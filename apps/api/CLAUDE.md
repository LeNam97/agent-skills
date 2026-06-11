# Backend — apps/api

> **Layer:** Backend only. Không load `apps/web/CLAUDE.md` hay font-end skill.

## Skill (bắt buộc)

1. Đọc `.cursor/skills/back-end/SKILL.md`
2. Đọc `workflows/load-rules.md` trong skill đó
3. Load **chỉ** rule khớp file đang sửa — không load toàn bộ `rules/`
4. Module dùng `packages/api-models/` → đọc thêm `overrides/e-ticket.md`

## Phạm vi

| Thư mục | Mục đích |
|---------|----------|
| `apps/api/src/` | NestJS controller, service, module |
| `packages/api-models/` | Entity, repository, database registration |
| `packages/shared/src/dto/` | Create/Update/Search DTOs |

## Pattern chính

- **Controller:** mỏng — delegate sang service, `@Route()`, `findAllAndCount`
- **Service:** inject `AcRequest` — lấy user từ `this.request.metadata.getUser()`, không nhận userId từ controller
- **Module:** register `NextAuthMiddleware` cho route
- **Entity:** extend `AcBaseEntity`, plural table name, `DB_TYPE`, comment tiếng Việt
- **Repository:** `applyListQueryFilters`, soft delete (`ModelStatus.DELETED`), keyword search
- **DTO:** `trimString()` / `trimStringOptional()`, message validation tiếng Việt

## Không làm trong layer này

- React components, Next.js pages, Tailwind styling
- `useEnhancedTable`, TanStack Query hooks
- `apiRequest`, form Zod frontend
