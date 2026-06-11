# Prompt: [Tên chức năng]

> **Role:** BA → Dev (Full-stack | Backend-only | Frontend-only)
> **Route API:** `apps/api/src/[module]/`
> **Route Web:** `apps/web/app/(admin)/[route]/`
> **Data source:** PostgreSQL qua TypeORM
> **Entity:** `packages/api-models/src/entity/[name].entity.ts`
> **DTO:** `packages/shared/src/dto/[module]/[name]-core.dto.ts`

---

## Mục tiêu

<!-- 2–3 câu: module làm gì, ai dùng, giá trị chính -->

## Skill Sử dụng

| Layer | Skill |
| ----- | ----- |
| Backend | `.cursor/skills/back-end` |
| Frontend | `.cursor/skills/font-end` |

Rules tự load theo file khi chạy task — xem `workflows/load-rules.md` trong từng skill. **Không liệt kê rule trong spec.**

## Mode sử dụng

- Sonnet 4.6

---

## Actors & Phân quyền

### Actors

| Actor     | Mô tả                      |
| --------- | -------------------------- |
| Admin     | Toàn quyền CRUD            |
| Nhân viên | Tạo, sửa, xem              |
| [Actor]   | [Phạm vi truy cập — scope] |

### Phân quyền

- Permission group: `PM0X_[TEN_MODULE]`
- Web dùng `useUserStore` → `permissionMap`
- Controller dùng `@ApiBearerAuth()` + guard kiểm tra permission

| Action        | Constant            |
| ------------- | ------------------- |
| Xem danh sách | `VIEW_[MODULE]`     |
| Tạo mới       | `[MODULE]_CREATE`   |
| Cập nhật      | `UPDATE_[MODULE]`   |
| Xoá           | `DELETE_[MODULE]`   |
| [Hành động]   | `[MODULE]_[ACTION]` |

---

## Màn hình danh sách

### Cột bảng (DataTable)

| Cột        | Field API           | Ghi chú                        |
| ---------- | ------------------- | ------------------------------ |
| STT        | _(tính theo trang)_ |                                |
| [Tên cột]  | `[field_name]`      | [Ghi chú: format, link, …]     |
| Trạng thái | `trang_thai`        | Badge màu theo nhóm trạng thái |
| Người tạo  | `nguoi_tao`         |                                |
| Ngày tạo   | `ngay_tao`          | Sortable, `dd/MM/yyyy HH:mm`   |
| Thao tác   | _(buttons)_         | Xem / Sửa / Xoá tuỳ permission |

### Bộ lọc & tìm kiếm

- **Keyword** — tìm theo `[field_1]`, `[field_2]`
- **Trạng thái** — dropdown multi-select từ `[Enum]`
- **[Dropdown]** — dropdown từ `[nguồn dữ liệu]`
- **[Date range]** — từ ngày / đến ngày

---

## Chi tiết [tên]

Hiển thị khi click "Xem chi tiết". File: `[name]-detail-dialog.tsx`

### [Nhóm thông tin 1]

| Trường         | Field          |
| -------------- | -------------- |
| [Tên hiển thị] | `[field_name]` |

### [Nhóm thông tin 2]

| Trường         | Field          |
| -------------- | -------------- |
| [Tên hiển thị] | `[field_name]` |

### Relations (load selective — không fetch full)

| Relation     | Entity          |
| ------------ | --------------- |
| `[relation]` | `[EntityClass]` |

---

## Form tạo / sửa

File: `[name]-form-dialog.tsx`

### [Nhóm trường]

| Trường | Field          | Bắt buộc | Ghi chú               |
| ------ | -------------- | :------: | --------------------- |
| [Nhãn] | `[field_name]` |    ✅    | [Validation, default] |
| [Nhãn] | `[field_name]` |          |                       |

---

## API Backend (NestJS)

### Endpoints

| Method | Route                  | Mô tả               | Permission        |
| ------ | ---------------------- | ------------------- | ----------------- |
| GET    | `/[module]/phan-trang` | Phân trang + filter | `VIEW_[MODULE]`   |
| GET    | `/[module]/:id`        | Chi tiết            | `VIEW_[MODULE]`   |
| POST   | `/[module]`            | Tạo mới             | `[MODULE]_CREATE` |
| PATCH  | `/[module]/:id`        | Cập nhật            | `UPDATE_[MODULE]` |
| DELETE | `/[module]/:id`        | Xoá (soft delete)   | `DELETE_[MODULE]` |

> **Lưu ý thứ tự route:** Route cụ thể (`/phan-trang`) phải đặt **trước** route param (`/:id`).

### Filter phân trang (`[Module]ListQueryDto`)

| Filter       | Kiểu   | Mô tả                             |
| ------------ | ------ | --------------------------------- |
| `keyword`    | string | Tìm theo `[field_1]`, `[field_2]` |
| `trang_thai` | enum   | Trạng thái                        |
| `tu_ngay`    | date   | Từ ngày                           |
| `den_ngay`   | date   | Đến ngày                          |
| `[filter]`   | [kiểu] | [Mô tả]                           |

### Repository filter (`applyListQueryFilters`)

> Tự sinh từ Bộ lọc BA — `applyListQueryFilters` + `listFilterConfig` trong repository (map từ bảng dưới). Rule `repo-apply-list-query-filters` tự load khi implement.

| Bộ lọc UI | Field DTO | `compare` | `dbColumn` |
| --------- | --------- | --------- | ---------- |
| Keyword — `[field_1]`, `[field_2]` | `keyword` | _(keyword)_ | `[alias].[field_1]`, `[alias].[field_2]` |
| Trạng thái | `trang_thai` | `in` | `[alias].trang_thai` |
| `[Dropdown FK]` | `[fk]_id` | `eq` | `[alias].[fk]_id` |
| `[Date range]` | `tu_ngay` / `den_ngay` | `gte` / `lte` | `[alias].[date_field]` |

**Options (nếu business rule BA có):**

| Rule BA | Option |
| ------- | ------ |
| Actor scope | `actorScope: { paramKey: '[scope_param]', dbColumn: '[join_alias].[column]' }` |
| Loại bản ghi đã xoá | `excludeDeleted: { column: '[alias].trang_thai', value: '[deleted_value]' }` |

- `/thong-ke` dùng cùng config + options (không phân trang)
- Join relation **trước** `applyListQueryFilters` khi cần `actorScope`

### Response contract (phân trang)

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "pageSize": 20
}
```

### Response contract (chi tiết)

```json
{
  "id": "uuid",
  "[field_1]": "[value]",
  "[field_2]": "[value]",
  "ngay_tao": "2026-01-01T00:00:00Z"
}
```

---

## Model & Enum

### Entity `[ClassName]` (bảng `[table_name]`)

#### Định danh & liên kết

| Trường    | Kiểu        | Bắt buộc | Mô tả                         |
| --------- | ----------- | :------: | ----------------------------- |
| `id`      | UUID (v7)   |    ✅    | PK, auto `uuid_generate_v7()` |
| `[field]` | varchar(50) |    ✅    | [Mô tả, unique nếu cần]       |

#### [Nhóm field 2]

| Trường    | Kiểu      | Bắt buộc | Mô tả   |
| --------- | --------- | :------: | ------- |
| `[field]` | timestamp |    ✅    | [Mô tả] |

#### Trạng thái & nguồn

| Trường       | Kiểu              | Default     | Mô tả              |
| ------------ | ----------------- | ----------- | ------------------ |
| `trang_thai` | enum `[EnumName]` | `[default]` | Trạng thái bản ghi |

### Enum `[EnumName]`

```
[value_1] | [value_2] | [value_3]
```

**Nhóm trạng thái UI (badge màu + filter):**

| Nhóm     | Giá trị                  |
| -------- | ------------------------ |
| [Nhóm 1] | `[value_1]`, `[value_2]` |
| [Nhóm 2] | `[value_3]`              |

---

## DTO & Validation

### DTO classes

| Class             | Method | Mô tả / Field bắt buộc          |
| ----------------- | ------ | ------------------------------- |
| `Create[Name]Dto` | POST   | `[field_1]`, `[field_2]`, …     |
| `Update[Name]Dto` | PATCH  | Tất cả optional (`PartialType`) |
| `Search[Name]Dto` | GET    | Filter fields                   |

### DTO ↔ Entity mapping

| DTO           | Entity             | Ghi chú                      |
| ------------- | ------------------ | ---------------------------- |
| `[dto_field]` | `[entity_field]`   | [Map rule nếu tên khác nhau] |
| —             | `[computed_field]` | Tự tính từ các field khác    |

### Quy tắc validation

- Đặt DTO trong `packages/shared/src/dto/[module]/`
- Dùng `class-validator`, message **tiếng Việt**
- Validate tại controller boundary trước khi gọi service

---

## Tiêu chí hoàn thành

### Backend

- [ ] Controller thin — logic trong service/repository
- [ ] Pagination + filter qua `[Name]ListQueryDto` + `applyListQueryFilters`
- [ ] Selective joins — không over-fetch relations
- [ ] Batch load sub-records — `IN` query, không loop
- [ ] DTO shared + validation tiếng Việt
- [ ] Swagger `@ApiOperation` / `@ApiResponse` trên mọi endpoint
- [ ] `NotFoundException` cho resource không tồn tại

### Frontend

- [ ] Bảng danh sách với filter + phân trang server-side
- [ ] Dialog chi tiết
- [ ] Form tạo / sửa (nếu có)
- [ ] Badge trạng thái có màu theo nhóm
- [ ] Kiểm tra permission trước khi render
