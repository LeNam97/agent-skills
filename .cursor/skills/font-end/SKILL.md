---
name: app-city-cms-front-end
description: Best practices for App City CMS frontend — Next.js, useEnhancedTable, apiRequest, RHF+Zod. Auto-loads rules from rules/ by file pattern when Layer=Frontend or editing apps/web, packages/ui. Use workflows/load-rules.md — do not list rules in specs.
metadata:
  author: app-city-cms-team
  version: "1.1.0"
---

# App City CMS — Front-end Practices

Conventions extracted from `.cursorrules`. **13 rules** — loaded on demand.

## Auto-load (bắt buộc)

Khi task **Layer = Frontend** hoặc sửa `apps/web/`, `packages/ui/`:

1. Đọc **[workflows/load-rules.md](workflows/load-rules.md)**
2. Load **chỉ** rule khớp file đang sửa (bảng pattern → rule)

Spec/prompt **chỉ** khai báo skill path — **không** liệt kê rule từng dòng.

## Module file structure

```
# Route module — chỉ chứa UI
apps/web/app/(module)/{entity-name}/
├── page.tsx                    # Re-export list component
├── {entity-name}.list.tsx      # Main list (useEnhancedTable)
├── fn.ts                       # Status/color helpers
├── components/                 # Feature-specific
├── create/                     # Create form
├── edit/                       # Edit form (or [id]/edit/)
└── [id]/                       # Detail page

# Domain module — API, types, constants
apps/web/domains/{entity-name}/
├── service.ts                  # apiRequest CRUD functions
├── types.ts                    # Response/payload types
├── constants.ts                # Hằng số, enums
└── index.ts                    # Barrel export
```

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | List Page | CRITICAL | `fe-list-` |
| 2 | API Client | CRITICAL | `fe-api-` |
| 3 | Form | HIGH | `fe-form-` |
| 4 | Filter | HIGH | `fe-filter-` |
| 5 | Component & Import | MEDIUM | `fe-ui-` |
| 6 | Auth & i18n | MEDIUM | `fe-auth-`, `fe-i18n-` |

## Quick Reference

### 1. List Page (CRITICAL)

- `fe-list-use-enhanced-table` — useEnhancedTable + generateQueryParams + queryKey
- `fe-list-client-directive` — `'use client'` on list pages
- `fe-list-column-order` — STT first, Actions second; columnHelper outside component
- `fe-list-permission-actions` — hasPermissions + AddButton/ExportButton

### 2. API Client (CRITICAL)

- `fe-api-no-mutation-hooks` — Không tạo React Query hooks cho CRUD; apiRequest trực tiếp
- `fe-api-toast-via-apirequest` — successMessage/errorMessage trong apiRequest, không toast thủ công

### 3. Form (HIGH)

- `fe-form-zod-rhf` — React Hook Form + zodResolver + Zod schema
- `fe-form-edit-useeffect-load` — Edit/detail load data bằng useEffect, không useQuery hooks

### 4. Filter (HIGH)

- `fe-filter-combobox-advanced-select-default` — combobox cho advanced, select cho default

### 5. Component & Import (MEDIUM)

- `fe-ui-prioritize-workspace-ui` — @workspace/ui trước; packages/ui nếu reusable
- `fe-ui-import-patterns` — @/ và ~/ absolute imports; cn() for classes

### 6. Auth & i18n (MEDIUM)

- `fe-i18n-next-intl` — useTranslations(); messages in apps/web/messages/
- `fe-auth-permission-check` — hasPermissions([PERMISSIONS.X]) trước render action

## How to Use

Rule files nằm trong `rules/`. Agent **không** đọc hết — follow `workflows/load-rules.md`.

Each rule: explanation, incorrect example, correct example.
