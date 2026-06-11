# Override: e-ticket stack (bookings, tau-thuyen, …)

Áp dụng khi module dùng `packages/api-models/` hoặc `withNextAuthMiddleware`.

| Convention mặc định (skill back-end) | e-ticket thực tế |
| ------------------------------------ | ---------------- |
| `packages/models/` | `packages/api-models/` |
| DTO trong `apps/api/.../dto/` | DTO trong `packages/shared/src/dto/[module]/` |
| `NextAuthMiddleware` trong `configure()` | `withNextAuthMiddleware(_Module, "route")` |
| `findAllAndCount` endpoint | Route cụ thể: `GET /[module]/phan-trang`, `GET /[module]/thong-ke` trước `:id` |
| Soft delete `ModelStatus.DELETED` | `trang_thai = da_xoa` (enum domain) |

Nguyên tắc layering (thin controller, repository pattern, DTO validation tiếng Việt) **giữ nguyên**.
