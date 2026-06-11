# Prompt: Quản lý đặt chỗ (Tàu thuyền)

> **Role:** BA → Dev (Full-stack)
> **Route API:** `apps/api/src/tau-thuyen/`
> **Route Web:** `apps/web/app/(admin)/quan-ly-tau-thuyen/`
> **Data source:** PostgreSQL qua TypeORM
> **Entity nghiệp vụ:** `packages/api-models/src/entity/bookings.entity.ts`
> **Entity tham chiếu:** `packages/api-models/src/entity/tau-thuyen.entity.ts`
> **DTO:** `packages/shared/src/dto/tau-thuyen/tau-thuyen-core.dto.ts`

---

## Phạm vi module

Module này quản lý **đặt chỗ (booking)** trong hệ thống e-ticket du lịch biển, với góc nhìn tập trung vào **tàu thuyền** và phân quyền **chủ tàu**.

| Khía cạnh | Giải thích |
| --------- | ---------- |
| Bảng dữ liệu chính | `bookings` — mọi CRUD thao tác trên booking |
| Bảng `tau_thuyen` | Master data tàu — chỉ join để hiển thị, filter, scope chủ tàu; **không** CRUD tàu trong module này |
| Khác module `bookings` | Route `/tau-thuyen`, permission group riêng, actor scope chủ tàu là yêu cầu bắt buộc |
| Tham khảo code có sẵn | `apps/api/src/bookings/` (pattern API), `packages/api-models/src/data-access/tau-thuyen.repository.ts` (filter + scope) |

---

## Mục tiêu

Cho phép **Admin** quản lý toàn bộ booking (xem, tạo, sửa, xoá, duyệt) và **Chủ tàu** chỉ xem booking thuộc tàu có `email` khớp tài khoản đăng nhập.
Màn hình danh sách có filter đa tiêu chí, thống kê tổng quan, và dialog chi tiết nhóm thông tin theo nghiệp vụ tàu/biển.

---

## Skill Sử dụng

| Layer | Skill |
| ----- | ----- |
| Backend | `.cursor/skills/back-end` |
| Frontend | `.cursor/skills/font-end` |
| Giao tiếp | `.cursor/skills/caveman` |

Rules tự load theo file khi chạy task — xem `workflows/load-rules.md` trong từng skill. Module dùng `packages/api-models/` → skill back-end đọc thêm `overrides/e-ticket.md`.

## Mode sử dụng

- Sonnet 4.6

---

## Actors & Phân quyền

### Actors

| Actor   | Mô tả                                                         |
| ------- | ------------------------------------------------------------- |
| Admin   | Toàn quyền CRUD + duyệt booking trên mọi tàu                  |
| Chủ tàu | Chỉ xem booking của tàu mình (scope theo `tau_thuyen.email`) |

### Phân quyền

- Permission group: `PM02_QUAN_LY_TAU_THUYEN`
- Web: `useUserStore` → `permissionMap`
- API: `@ApiBearerAuth()` + guard permission
- Service scope `REQUEST` — lấy email session, inject `chu_tau_email` khi actor là chủ tàu (client **không** gửi scope param)

| Action        | Constant                |
| ------------- | ----------------------- |
| Xem danh sách | `VIEW_TAU_THUYEN`       |
| Tạo mới       | `TAU_THUYEN_CREATE`     |
| Cập nhật      | `UPDATE_TAU_THUYEN`     |
| Xoá           | `DELETE_TAU_THUYEN`     |
| Duyệt         | `TAU_THUYEN_DUYET`      |
| Chủ tàu xem   | `SHIP_OWNER_TAU_THUYEN` |

---

## Phân rã task

| #   | Task | Layer | Phụ thuộc | File chính | Model |
| --- | ---- | ----- | --------- | ----------- | ----- |
| T1  | Xác nhận Entity + Enum | Backend | — | `entity/bookings.entity.ts`, `entity/tau-thuyen.entity.ts`, `types/booking.ts` | Composer 2.5 |
| T2  | Repository + filter + thống kê | Backend | T1 | `data-access/tau-thuyen.repository.ts` | _theo Mode_ |
| T3  | DTO Create/Update/Search + Duyệt | Backend | T1 | `dto/tau-thuyen/tau-thuyen-core.dto.ts` | _theo Mode_ |
| T4  | API module NestJS (list, thống kê, chi tiết) | Backend | T2, T3 | `tau-thuyen.controller.ts`, `tau-thuyen.service.ts`, `tau-thuyen.module.ts` | _theo Mode_ |
| T5  | API tạo / sửa / xoá / duyệt | Backend | T3, T4 | `tau-thuyen.controller.ts`, `tau-thuyen.service.ts` | _theo Mode_ |
| T6  | Permission constants | Backend | — | `permissions/pm2.permission.ts` | _theo Mode_ |
| T7  | Domain service + API client web | Frontend | T4 | `domains/tau-thuyen/`, `tau-thuyen.api.ts` | _theo Mode_ |
| T8  | Trang danh sách + filter + cards | Frontend | T4, T7 | `tau-thuyen-list.tsx`, `fn.ts` | _theo Mode_ |
| T9  | Dialog chi tiết | Frontend | T4, T7 | `tau-thuyen-detail-dialog.tsx` | _theo Mode_ |
| T10 | Form tạo / sửa + dialog duyệt | Frontend | T5, T7 | `tau-thuyen-form-dialog.tsx` | _theo Mode_ |

**Thứ tự thực thi:** T1 → T2 ∥ T3 ∥ T6 → T4 → T5 → T7 → T8 ∥ T9 → T10.

### T1 — Xác nhận Entity + Enum

- **Model:** Composer 2.5 (`composer-2.5-fast`)
- **Mô tả:** Xác nhận `Bookings` và `TauThuyen` khớp field spec; relation `booking.tau_thuyen_id` → `TauThuyen`; enum `BookingTrangThai` đủ giá trị duyệt/từ chối
- **Done khi:** Compile OK, FK relation đúng, enum cover `ban_nhap`, `da_duyet`, `bi_tu_choi`, `da_xoa`

### T2 — Repository + filter + thống kê

- **Mô tả:** Custom repository trên `Bookings`, join `tau_thuyen`, `applyListQueryFilters` inline; `actorScope` qua `chu_tau_email`
- **Done khi:** `findPaginated`, `findByIdWithRelations`, `getThongKe`, `markAsDeleted` hoạt động

---

## Màn hình danh sách

File: `tau-thuyen-list.tsx` — `DataTable` + `useEnhancedTable`, phân trang server-side.

### Cột bảng

| Cột        | Field API            | Ghi chú                          |
| ---------- | -------------------- | -------------------------------- |
| STT        | _(tính theo trang)_  |                                  |
| Mã đặt chỗ | `ma_dat_cho`         | Link mở dialog chi tiết          |
| Tàu        | `tau_thuyen.ten_tau` | Join selective                   |
| Ngày đi    | `ngay_di`            | `dd/MM/yyyy HH:mm`               |
| Ngày về    | `ngay_ve`            | Nullable, `dd/MM/yyyy HH:mm`     |
| Tổng khách | `th_tong_so_khach`   | Có thể hiển thị VN / nước ngoài  |
| Tổng tiền  | `th_tong_tien`       | Format VNĐ                       |
| Trạng thái | `trang_thai`         | Badge theo nhóm enum             |
| Người tạo  | `nguoi_tao`          |                                  |
| Ngày tạo   | `ngay_tao`           | Sortable, `dd/MM/yyyy HH:mm`     |
| Thao tác   | _(buttons)_          | Xem / Sửa / Xoá / Duyệt tuỳ quyền |

### Bộ lọc & tìm kiếm

| Bộ lọc UI   | Field API          | Kiểu UI        |
| ----------- | ------------------ | -------------- |
| Keyword     | `keyword`          | Text, debounce 300ms — tìm `ma_dat_cho`, `nguoi_tao` |
| Trạng thái  | `trang_thai`       | Multi-select `BookingTrangThai` |
| Tàu thuyền  | `tau_thuyen_id`    | Combobox advanced |
| Hành trình  | `ht_ma_hanh_trinh` | Combobox advanced (mã hành trình) |
| Ngày đi     | `tu_ngay`, `den_ngay` | Date range advanced |

### Thống kê (summary cards)

Gọi `GET /tau-thuyen/thong-ke` — cùng filter với bảng, không phân trang.

| Card           | Logic |
| -------------- | ----- |
| Tổng booking   | COUNT theo filter hiện tại |
| Chờ duyệt      | `da_gui` + `gui_lai` + `chua_duyet` |
| Đã duyệt       | `da_duyet` + `da_chot` |
| Tổng doanh thu | SUM `th_tong_tien` booking trạng thái đã duyệt/chốt |

---

## Chi tiết booking

File: `tau-thuyen-detail-dialog.tsx` — read-only, chia section.

### Thông tin chung

| Trường        | Field              |
| ------------- | ------------------ |
| Mã đặt chỗ    | `ma_dat_cho`       |
| Trạng thái     | `trang_thai`       |
| Nguồn đặt chỗ | `nguon_dat_cho`    |
| Ngày đi        | `ngay_di`          |
| Ngày về        | `ngay_ve`          |
| Hành trình     | `ht_ma_hanh_trinh` |
| Ghi chú        | `ghi_chu`          |

### Thông tin tàu

| Trường          | Field                        |
| --------------- | ---------------------------- |
| Tên tàu         | `tau_thuyen.ten_tau`         |
| Mã tàu          | `tau_thuyen.ma_tau`          |
| Sức chứa tối đa | `tau_thuyen.suc_chua_toi_da` |

### Thuyền trưởng & thuyền viên

| Trường              | Field                            |
| ------------------- | -------------------------------- |
| Tên thuyền trưởng   | `tt_ten_thuyen_truong`           |
| Số giấy phép lái tàu| `tt_so_giay_phep_lai_tau`        |
| SĐT thuyền trưởng   | `tt_so_dien_thoai_thuyen_truong` |
| Số thuyền viên      | `tt_so_luong_thuyen_vien`        |
| Số NV phục vụ       | `tt_so_luong_nhan_vien_phuc_vu`  |

### Khách & tài chính

| Trường                | Field                      |
| --------------------- | -------------------------- |
| Tổng khách Việt Nam   | `th_tong_khach_viet_nam`   |
| Tổng khách nước ngoài | `th_tong_khach_nuoc_ngoai` |
| Tổng số khách         | `th_tong_so_khach`         |
| Tổng tiền             | `th_tong_tien`             |

### Danh sách hành khách (sub-table)

| Trạng thái booking | Nguồn dữ liệu |
| ------------------ | ------------- |
| `ban_nhap`         | `BookingHanhKhachDraft` |
| Khác               | `BookingHanhKhach` |

### Relations (selective join)

| Relation                | Entity                 |
| ----------------------- | ---------------------- |
| `tau_thuyen`            | `TauThuyen`            |
| `booking_hanh_khach`    | `BookingHanhKhach[]`   |
| `booking_file_dinh_kem` | `BookingFileDinhKem[]` |

---

## Form tạo / sửa

File: `tau-thuyen-form-dialog.tsx` — RHF + Zod, `apiRequest` cho mutation.

### Thông tin chung

| Trường        | Field              | Bắt buộc | Ghi chú                    |
| ------------- | ------------------ | :------: | -------------------------- |
| Mã đặt chỗ    | `ma_dat_cho`       | ✅       | Unique                     |
| Tàu thuyền    | `tau_thuyen_id`    | ✅       | Combobox danh sách tàu     |
| Ngày đi       | `ngay_di`          | ✅       | DateTime                   |
| Ngày về       | `ngay_ve`          |          | Nullable                   |
| Hành trình    | `ht_ma_hanh_trinh` |          | Multi-select mã            |
| Nguồn đặt chỗ | `nguon_dat_cho`    | ✅       | Default `nhan_vien_ban_ve` |
| Ghi chú       | `ghi_chu`          |          |                            |

### Thuyền trưởng & thuyền viên

| Trường            | Field                            | Bắt buộc |
| ----------------- | -------------------------------- | :------: |
| Tên thuyền trưởng | `tt_ten_thuyen_truong`           |          |
| Số giấy phép      | `tt_so_giay_phep_lai_tau`        |          |
| SĐT thuyền trưởng | `tt_so_dien_thoai_thuyen_truong` |          |
| Số thuyền viên    | `tt_so_luong_thuyen_vien`        |          |
| Số NV phục vụ     | `tt_so_luong_nhan_vien_phuc_vu`  |          |

### Khách & tài chính

| Trường           | Field                      | Bắt buộc | Ghi chú |
| ---------------- | -------------------------- | :------: | ------- |
| Khách Việt Nam   | `th_tong_khach_viet_nam`   | ✅       | Default 0 |
| Khách nước ngoài | `th_tong_khach_nuoc_ngoai` | ✅       | Default 0 |
| Tổng số khách    | `th_tong_so_khach`         |          | Read-only UI — service tính |
| Tổng tiền        | `th_tong_tien`             |          |         |
| Trạng thái       | `trang_thai`               |          | Default `ban_nhap` khi tạo |

### Dialog duyệt

| Trường    | Field        | Bắt buộc | Ghi chú |
| --------- | ------------ | :------: | ------- |
| Hành động | `trang_thai` | ✅       | `da_duyet` hoặc `bi_tu_choi` |
| Ghi chú   | `ghi_chu`    |          | Lý do từ chối |

---

## API Backend (NestJS)

Module: `withNextAuthMiddleware(_TauThuyenModule, "tau-thuyen")`.

### Endpoints

| Method | Route                    | Mô tả | Permission |
| ------ | ------------------------ | ----- | ---------- |
| GET    | `/tau-thuyen/phan-trang` | Phân trang + filter | `VIEW_TAU_THUYEN` hoặc `SHIP_OWNER_TAU_THUYEN` |
| GET    | `/tau-thuyen/thong-ke`   | Thống kê theo filter | `VIEW_TAU_THUYEN` hoặc `SHIP_OWNER_TAU_THUYEN` |
| GET    | `/tau-thuyen/:id`        | Chi tiết booking | `VIEW_TAU_THUYEN` hoặc `SHIP_OWNER_TAU_THUYEN` |
| POST   | `/tau-thuyen`            | Tạo booking | `TAU_THUYEN_CREATE` |
| PATCH  | `/tau-thuyen/:id`        | Cập nhật | `UPDATE_TAU_THUYEN` |
| PATCH  | `/tau-thuyen/:id/duyet`  | Duyệt / từ chối | `TAU_THUYEN_DUYET` |
| DELETE | `/tau-thuyen/:id`        | Soft delete (`da_xoa`) | `DELETE_TAU_THUYEN` |

> Route cụ thể (`phan-trang`, `thong-ke`) đặt **trước** `/:id`.

### Filter phân trang (`TauThuyenListQueryDto`)

| Filter             | Kiểu     | Mô tả |
| ------------------ | -------- | ----- |
| `keyword`          | string   | `ma_dat_cho`, `nguoi_tao` |
| `trang_thai`       | enum[]   | Multi-select |
| `tau_thuyen_id`    | UUID     | Dropdown tàu |
| `ht_ma_hanh_trinh` | string[] | Mã hành trình |
| `tu_ngay`          | date     | Ngày đi từ |
| `den_ngay`         | date     | Ngày đi đến |
| `page`             | number   | Default 1 |
| `pageSize`         | number   | Default 20 |

### Repository filter (`applyListQueryFilters`)

Config inline trong `tau-thuyen.repository.ts` — alias `booking`, join `tau_thuyen` trước khi filter.

| Bộ lọc UI | Field DTO | `compare` | `dbColumn` |
| --------- | --------- | --------- | ---------- |
| Keyword | `keyword` | _(keyword)_ | `booking.ma_dat_cho`, `booking.nguoi_tao` |
| Trạng thái | `trang_thai` | `in` | `booking.trang_thai` |
| Tàu thuyền | `tau_thuyen_id` | `eq` | `booking.tau_thuyen_id` |
| Hành trình | `ht_ma_hanh_trinh` | `array-overlap` | `booking.ht_ma_hanh_trinh` |
| Ngày đi | `tu_ngay` / `den_ngay` | `gte` / `lte` | `booking.ngay_di` |

**Options:**

| Business rule | Option |
| ------------- | ------ |
| Chủ tàu scope email | `actorScope: { paramKey: 'chu_tau_email', dbColumn: 'tau_thuyen.email' }` |
| Loại đã xoá | `excludeDeleted: { column: 'booking.trang_thai', value: 'da_xoa' }` |
| Thống kê | `/thong-ke` dùng cùng config + options |

### Response phân trang

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "pageSize": 20
}
```

---

## Model & Enum

### Entity `TauThuyen` (bảng `tau_thuyen`)

Tham chiếu — không CRUD trong module.

| Trường            | Kiểu         | Bắt buộc | Mô tả |
| ----------------- | ------------ | :------: | ----- |
| `id`              | UUID         | ✅       | PK |
| `ten_tau`         | varchar(200) | ✅       | Tên tàu |
| `ma_tau`          | varchar(50)  | ✅       | Mã tàu |
| `suc_chua_toi_da` | int          |          | Sức chứa |
| `email`           | varchar(255) |          | Email chủ tàu — actor scope |

### Entity `Bookings` (bảng `bookings`)

Entity nghiệp vụ chính. Field module dùng:

| Nhóm | Field |
| ---- | ----- |
| Định danh | `id`, `ma_dat_cho`, `tau_thuyen_id`, `tenant_code` |
| Lịch trình | `ngay_di`, `ngay_ve`, `ht_ma_hanh_trinh` |
| Khách | `th_tong_khach_viet_nam`, `th_tong_khach_nuoc_ngoai`, `th_tong_so_khach` |
| Trạng thái | `trang_thai` (default `ban_nhap`), `nguon_dat_cho` |
| Tài chính | `th_tong_tien`, `ghi_chu`, `nguoi_tao` |
| Thuyền trưởng | `tt_ten_thuyen_truong`, `tt_so_giay_phep_lai_tau`, `tt_so_dien_thoai_thuyen_truong`, `tt_so_luong_thuyen_vien`, `tt_so_luong_nhan_vien_phuc_vu` |

Chi tiết đầy đủ: `prompts/chuc-nang-booking.md`.

### Enum `BookingTrangThai`

```
ban_nhap | da_gui | chua_duyet | da_duyet | bi_tu_choi
da_thanh_toan | dang_in | da_in | in_loi | hoan_thanh | da_huy | da_xoa
gui_lai | mua_them | tu_choi_mua_them | gui_lai_mua_them | duyet_mua_them
huy_mua_them | dang_them_khach | da_chot
```

**Nhóm badge UI:**

| Nhóm | Giá trị |
| ---- | ------- |
| Nháp | `ban_nhap` |
| Chờ duyệt | `da_gui`, `gui_lai`, `chua_duyet` |
| Đã duyệt | `da_duyet`, `da_chot` |
| Từ chối | `bi_tu_choi` |
| Thanh toán / in | `da_thanh_toan`, `dang_in`, `da_in`, `in_loi` |
| Hoàn tất / huỷ | `hoan_thanh`, `da_huy`, `da_xoa` |

---

## DTO & Validation

| Class | Method | Mô tả |
| ----- | ------ | ----- |
| `CreateTauThuyenDto` | POST | `ma_dat_cho`, `tau_thuyen_id`, `ngay_di`, `th_tong_khach_viet_nam`, `th_tong_khach_nuoc_ngoai`, `nguon_dat_cho` |
| `UpdateTauThuyenDto` | PATCH | `PartialType(CreateTauThuyenDto)` |
| `TauThuyenListQueryDto` | GET | Filter từ bộ lọc màn hình |
| `DuyetTauThuyenDto` | PATCH | `trang_thai` (`da_duyet` \| `bi_tu_choi`), `ghi_chu` optional |

**Mapping đặc biệt:**

| DTO / Service | Entity | Ghi chú |
| ------------- | ------ | ------- |
| Create/Update fields | `Bookings` | Persist vào `bookings` |
| — | `th_tong_so_khach` | Service tính = VN + nước ngoài |
| — | `trang_thai` | Default `ban_nhap` khi create |

- DTO path: `packages/shared/src/dto/tau-thuyen/`
- Validation message tiếng Việt, `trimString` cho string field

---

## Business rules

| # | Rule |
| - | ---- |
| 1 | Chủ tàu chỉ thấy booking có `tau_thuyen.email` = email đăng nhập — enforce ở service/repository, không filter client |
| 2 | `th_tong_so_khach` = `th_tong_khach_viet_nam` + `th_tong_khach_nuoc_ngoai` — tính server-side khi create/update |
| 3 | Trạng thái mặc định khi tạo: `ban_nhap` |
| 4 | Xoá = soft delete — set `trang_thai = da_xoa` |
| 5 | Hành khách: `ban_nhap` đọc draft table, còn lại đọc bảng chính |
| 6 | Duyệt chỉ chuyển `da_duyet` hoặc `bi_tu_choi` |

---

## Cấu trúc file

```
apps/api/src/tau-thuyen/
├── tau-thuyen.controller.ts
├── tau-thuyen.service.ts          # Scope REQUEST — chủ tàu
└── tau-thuyen.module.ts           # withNextAuthMiddleware

packages/api-models/src/
├── entity/bookings.entity.ts      # Đã có
├── entity/tau-thuyen.entity.ts    # Đã có
├── data-access/tau-thuyen.repository.ts  # Đã có — chỉnh theo spec
└── types/booking.ts

packages/shared/src/dto/tau-thuyen/
├── tau-thuyen-core.dto.ts
└── index.ts

apps/web/app/(admin)/quan-ly-tau-thuyen/
├── page.tsx                       # Re-export tau-thuyen-list
├── tau-thuyen-list.tsx
├── tau-thuyen.api.ts
├── fn.ts
├── tau-thuyen-detail-dialog.tsx
└── tau-thuyen-form-dialog.tsx

apps/web/domains/tau-thuyen/
├── service.ts
├── types.ts
├── constants.ts
└── index.ts

packages/permissions/src/
└── permissions/pm2.permission.ts
```

**Pattern tham khảo:** `apps/api/src/bookings/`, `prompts/chuc-nang-booking.md`.

---

## Lưu ý kỹ thuật

- Controller thin — business logic trong service/repository
- `TauThuyenRepository` extends `Repository<Bookings>` — tên module ≠ bảng chính, cố ý
- Selective join `tau_thuyen`: chỉ `id`, `ten_tau`, `ma_tau`, `suc_chua_toi_da`, `email`
- Batch load hành khách: `IN` query, tránh N+1
- Frontend: `apiRequest` + toast; không mutation hook riêng
- `NotFoundException` khi booking không tồn tại hoặc ngoài scope chủ tàu
- Swagger đầy đủ trên mọi endpoint

---

## Tiêu chí hoàn thành

### Backend

- [ ] Module `tau-thuyen` đăng ký trong `app.module.ts`
- [ ] Pagination + filter qua `TauThuyenListQueryDto` + `applyListQueryFilters`
- [ ] Actor scope chủ tàu qua `chu_tau_email`
- [ ] Endpoint thống kê dùng cùng filter config
- [ ] DTO shared + validation tiếng Việt
- [ ] Swagger + `NotFoundException`
- [ ] Soft delete `da_xoa`

### Frontend

- [ ] Trang danh sách: filter, phân trang server-side, summary cards
- [ ] Dialog chi tiết theo nhóm thông tin
- [ ] Form tạo/sửa + dialog duyệt
- [ ] Badge trạng thái theo nhóm màu
- [ ] Permission gate trên nút thao tác
- [ ] Chủ tàu chỉ thấy booking của tàu mình (API scope)
