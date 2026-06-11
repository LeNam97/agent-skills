# Auto-load front-end rules

Khi chạy task **Layer = Frontend** (hoặc sửa file trong `apps/web/`, `packages/ui/`), agent **bắt buộc** làm theo flow này. Spec **không** cần liệt kê từng rule.

## Bước 1 — Load skill

Đọc `.cursor/skills/font-end/SKILL.md` (đang active).

## Bước 2 — Chọn rule theo file đang sửa

Chỉ **Read** các rule khớp pattern:

| File / ngữ cảnh | Rules load (`rules/*.md`) |
| --------------- | ------------------------- |
| `page.tsx` (module entry) | `fe-module-file-structure` |
| `*-list.tsx`, `*.list.tsx` | `fe-list-use-enhanced-table`, `fe-list-client-directive`, `fe-list-column-order`, `fe-list-permission-actions`, `fe-filter-combobox-advanced-select-default` |
| `domains/*/service.ts`, `domains/*/types.ts` | `fe-api-no-mutation-hooks`, `fe-api-toast-via-apirequest` |
| `*form*.tsx`, `create/`, `edit/` | `fe-form-zod-rhf`, `fe-form-edit-useeffect-load` |
| `*detail*.tsx`, `*dialog*.tsx` (read-only) | `fe-form-edit-useeffect-load`, `fe-ui-prioritize-workspace-ui` |
| Component UI bất kỳ | `fe-ui-prioritize-workspace-ui`, `fe-ui-import-patterns` |
| i18n / messages | `fe-i18n-next-intl` |
| Verify cấu trúc route | `fe-verify-route-structure` |
| Module web mới (lần đầu setup) | `fe-module-file-structure` + `fe-verify-route-structure` + các rule list/api tương ứng |

## Bước 3 — Subagent / Task tool

```
Layer: Frontend
Skill: .cursor/skills/font-end/SKILL.md
Trước khi code: đọc workflows/load-rules.md và load rule theo file trong task.
```

## Bước 4 — Verify

Đối chiếu output với rule đã load trước khi đánh dấu task done.
