# Auto-load back-end rules

Khi chạy task **Layer = Backend** (hoặc sửa file trong `apps/api/`, `packages/api-models/`, `packages/shared/src/dto/`), agent **bắt buộc** làm theo flow này. Spec **không** cần liệt kê từng rule — skill tự quyết định rule nào load.

## Bước 1 — Load skill + override (nếu có)

1. Đọc `.cursor/skills/back-end/SKILL.md` (đang active)
2. Nếu module dùng `packages/api-models/` hoặc `withNextAuthMiddleware` → đọc thêm `overrides/e-ticket.md`

## Bước 2a — Chọn rule theo description / mô tả task (ưu tiên)

Quét **mô tả task** (spec, prompt, user message, tên task trong Phân rã task). Mỗi rule có field `description` trong frontmatter — nếu mô tả task **khớp ý nghĩa** → **bắt buộc** load rule đó **trước khi code**, kể cả chưa xác định file cụ thể.

| Rule | Kích hoạt khi description chứa (không phân biệt hoa thường) |
| ---- | ------------------------------------------------------------- |
| `repo-apply-list-query-filters` | `filter`, `bộ lọc`, `phân trang`, `list query`, `applyListQueryFilters`, `ListQueryFilterConfig`, `SearchDto`, `ListQueryDto`, `findPaginated`, `findAllAndCount`, `keyword`, `tu_ngay`, `den_ngay`, `trang_thai` + filter, `repository` + filter, `thống kê` + filter, `data-access` + filter |

**Cách khớp:** đọc frontmatter `description` của rule trong `rules/*.md` — overlap từ khóa hoặc ngữ cảnh nghiệp vụ (vd: "T1 — Repository + filter phân trang") → load.

Khi khớp `repo-apply-list-query-filters` **và** task có endpoint phân trang → load thêm `api-find-all-and-count`.

## Bước 2b — Chọn rule theo file đang sửa

Chỉ **Read** các rule khớp pattern dưới đây — không load toàn bộ thư mục `rules/`.

| File / ngữ cảnh | Rules load (`rules/*.md`) |
| --------------- | ------------------------- |
| `*.controller.ts` | `nest-thin-controller`, `nest-controller-route-pattern`, `auth-acrequest-not-controller-param` |
| `*.service.ts` | `nest-acrequest-user-context`, `auth-acrequest-not-controller-param`, `nest-thin-controller` |
| `*.module.ts` | `nest-nextauth-middleware` |
| `*.repository.ts`, `data-access/*` | `repo-custom-repository-class`, `repo-apply-list-query-filters`, `repo-soft-delete-keyword` |
| `list-query/*` (api-common) | `repo-apply-list-query-filters` |
| `entity/*.entity.ts` (mới) | `entity-ac-base-entity`, `entity-plural-table-comments`, `entity-db-type-helpers`, `repo-register-entity-three-places` |
| `entity/*.entity.ts` (sửa) | `entity-plural-table-comments`, `entity-db-type-helpers` |
| `dto/*`, `*-core.dto.ts` | `dto-trim-string-transform`, `dto-vietnamese-messages`, `dto-decorator-order` |
| `*ListQueryDto*`, `*SearchDto*` trong tên DTO / mô tả | `repo-apply-list-query-filters`, `dto-trim-string-transform`, `dto-vietnamese-messages` |
| List endpoint / phân trang | `api-find-all-and-count`, `repo-apply-list-query-filters` |
| Bất kỳ file backend mới | `mono-package-boundaries` |

Nhiều pattern khớp → load **hợp** các rule (dedupe). **Bước 2a + 2b** cộng dồn, không bỏ qua 2a khi đã khớp file pattern.

## Bước 3 — Subagent / Task tool

Khi gửi task Backend qua Task tool, prompt subagent **phải** gồm:

```
Layer: Backend
Skill: .cursor/skills/back-end/SKILL.md
Trước khi code: đọc workflows/load-rules.md — Bước 2a (description task) rồi Bước 2b (file pattern).
Override e-ticket: overrides/e-ticket.md (nếu áp dụng)
```

Không paste danh sách rule vào spec — subagent tự resolve từ bảng trên.

## Bước 4 — Verify

Trước khi kết thúc task, đối chiếu output với các rule đã load (✅/❌ trong từng file rule).
