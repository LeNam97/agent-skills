# Frontend — apps/web

> **Layer:** Frontend only. Không load `apps/api/CLAUDE.md` hay back-end skill.

## Skill (bắt buộc)

1. Đọc `.cursor/skills/font-end/SKILL.md`
2. Đọc `workflows/load-rules.md` trong skill đó
3. Load **chỉ** rule khớp file đang sửa — không load toàn bộ `rules/`

## Phạm vi

| Thư mục | Mục đích |
|---------|----------|
| `apps/web/` | Next.js App Router, pages, list, form, API client |
| `packages/ui/` | Shared UI components (`@workspace/ui`) |

## Next.js

@AGENTS.md

## Pattern chính

- **List:** `useEnhancedTable`, `generateQueryParams`, `'use client'`
- **API client:** `apiRequest` — không tạo React Query mutation hooks cho CRUD
- **Form:** React Hook Form + Zod; edit page load data qua `useEffect`
- **UI:** ưu tiên `@workspace/ui` trước khi tạo component mới
- **i18n:** `next-intl`, messages trong `apps/web/messages/`
- **Filter:** `combobox` cho `position: 'advanced'`, `select` cho `position: 'default'`

## Không làm trong layer này

- NestJS controller / service / module
- TypeORM entity, repository (`packages/api-models/`)
- DTO validation backend (`packages/shared/src/dto/`)
