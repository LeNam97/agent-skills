# App City CMS — Root

## Layer routing (bắt buộc)

Mỗi task chỉ load **một** CLAUDE.md theo layer — **không** load đồng thời `apps/web/CLAUDE.md` và `apps/api/CLAUDE.md`.

| Layer | Đọc file | Phạm vi |
|-------|----------|---------|
| **Frontend** | `apps/web/CLAUDE.md` | `apps/web/`, `packages/ui/` |
| **Backend** | `apps/api/CLAUDE.md` | `apps/api/`, `packages/api-models/`, `packages/shared/src/dto/` |

**Xác định layer từ:**

1. Field `Layer` trong spec/prompt (`Frontend` / `Backend`)
2. File đang sửa (ưu tiên nếu không có Layer trong prompt)
3. Route trong metadata (`Route Web` → Frontend, `Route API` → Backend)

**Full-stack:** tách thành nhiều task — mỗi task một layer; chuyển CLAUDE.md khi chuyển task.

**Không** đọc `.cursorrules` toàn bộ — layer CLAUDE.md + skill tương ứng đủ cho task.

## Next.js (chung)

@AGENTS.md
