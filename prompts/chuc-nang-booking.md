# Prompt: Chức năng Quản lý Booking

> **Role:** BA → Dev (Full-stack)
> **Route API:** `apps/api/src/bookings/`
> **Route Web:** `apps/web/app/(admin)/quan-ly-booking/`
> **Data source:** PostgreSQL qua TypeORM
> **Entity:** `packages/api-models/src/entity/bookings.entity.ts`
> **DTO:** `packages/shared/src/dto/bookings/bookings-core.dto.ts`

---

## Mục tiêu

Module **Quản lý đặt chỗ (Booking)** cho hệ thống e-ticket du lịch biển.
Nhân viên / admin xem danh sách, lọc, phân trang, tạo/sửa/xoá booking.
Chủ tàu chỉ xem booking của tàu mình (scope theo email đăng nhập).

---

## Phân quyền

- Permission group: `PM01_QUAN_LY_BOOKING`
- Dùng `useUserStore` để lấy `permissionMap` (phía web)
- Controller dùng `@ApiBearerAuth()` + guard kiểm tra permission

| Action          | Constant          |
| --------------- | ----------------- |
| Xem danh sách   | `VIEW_BOOKING`    |
| Tạo mới         | `BOOKING_CREATE`  |
| Cập nhật        | `UPDATE_BOOKING`  |
| Xoá             | `DELETE_BOOKING`  |
| Duyệt           | `BOOKING_APPROVAL`|
| Chủ tàu xem     | `SHIP_OWNER_BOOKING` |

---

## Màn hình chính — Danh sách booking

### Thông tin hiển thị trên bảng (DataTable)

| Cột            | Field API                | Ghi chú                             |
| -------------- | ------------------------ | ----------------------------------- |
| STT            | _(tính theo trang)_      |                                     |
| Mã đặt chỗ    | `ma_dat_cho`             | Text search, link tới chi tiết      |
| Tàu            | `tau_thuyen.ten_tau`     | Dropdown filter                     |
| Ngày đi        | `ngay_di`                | Date format `dd/MM/yyyy HH:mm`      |
| Ngày về        | `ngay_ve`                | Date format, nullable               |
| Tổng khách     | `th_tong_so_khach`       | Badge VN / nước ngoài nếu cần       |
| Tổng tiền      | `th_tong_tien`           | Format tiền VNĐ                     |
| Trạng thái     | `trang_thai`             | Badge màu theo nhóm trạng thái      |
| Người tạo      | `nguoi_tao`              |                                     |
| Ngày tạo       | `ngay_tao`               | Sortable, date format               |
| Thao tác       | _(buttons)_              | Xem / Sửa / Xoá tuỳ permission     |

### Bộ lọc & tìm kiếm

- **Keyword** — tìm theo `ma_dat_cho`, `nguoi_tao`
- **Trạng thái** — dropdown multi-select từ `BookingTrangThai`
- **Tàu thuyền** — dropdown từ danh sách tàu (`tau_thuyen_id`)
- **Hành trình** — dropdown từ mã hành trình (`ht_ma_hanh_trinh`)
- **Ngày đi** — date range filter (`tu_ngay` / `den_ngay`)

### Thống kê (summary cards)

Hiển thị phía trên bảng, gọi endpoint `/bookings/thong-ke`:

| Card             | Mô tả                          |
| ---------------- | ------------------------------- |
| Tổng booking     | Đếm tất cả theo filter hiện tại |
| Chờ duyệt       | `da_gui` + `gui_lai` + `chua_duyet` |
| Đã duyệt        | `da_duyet` + `da_chot`         |
| Tổng doanh thu   | Tổng `th_tong_tien` các booking đã duyệt |

---

## Chi tiết booking

Hiển thị khi click "Xem chi tiết". File: `booking-detail-dialog.tsx`

### Thông tin chung

| Trường          | Field                  |
| --------------- | ---------------------- |
| Mã đặt chỗ     | `ma_dat_cho`           |
| Trạng thái      | `trang_thai`           |
| Nguồn đặt chỗ  | `nguon_dat_cho`        |
| Ngày đi         | `ngay_di`              |
| Ngày về         | `ngay_ve`              |
| Hành trình      | `ht_ma_hanh_trinh`     |
| Ghi chú         | `ghi_chu`              |

### Thông tin tàu

| Trường            | Field                    |
| ----------------- | ------------------------ |
| Tên tàu           | `tau_thuyen.ten_tau`     |
| Mã tàu            | `tau_thuyen.ma_tau`      |
| Sức chứa tối đa   | `tau_thuyen.suc_chua_toi_da` |

### Thông tin thuyền trưởng & thuyền viên

| Trường                     | Field                              |
| -------------------------- | ---------------------------------- |
| Tên thuyền trưởng          | `tt_ten_thuyen_truong`             |
| Số giấy phép lái tàu      | `tt_so_giay_phep_lai_tau`          |
| SĐT thuyền trưởng         | `tt_so_dien_thoai_thuyen_truong`   |
| Số lượng thuyền viên       | `tt_so_luong_thuyen_vien`          |
| Số lượng NV phục vụ        | `tt_so_luong_nhan_vien_phuc_vu`    |

### Thông tin khách & tài chính

| Trường                | Field                      |
| --------------------- | -------------------------- |
| Tổng khách Việt Nam   | `th_tong_khach_viet_nam`   |
| Tổng khách nước ngoài | `th_tong_khach_nuoc_ngoai` |
| Tổng số khách         | `th_tong_so_khach`         |
| Tổng tiền             | `th_tong_tien`             |

### Danh sách hành khách (sub-table)

| Trạng thái booking | Bảng hành khách         |
| ------------------ | ----------------------- |
| `ban_nhap`         | `BookingHanhKhachDraft` |
| Khác               | `BookingHanhKhach`      |

### Relations (load selective — không fetch full)

| Relation                | Entity                 |
| ----------------------- | ---------------------- |
| `tau_thuyen`            | `TauThuyen`            |
| `cang_ban`              | `CangBan`              |
| `nhan_vien_xu_ly_info`  | `TnNguoiDung`          |
| `booking_file_dinh_kem` | `BookingFileDinhKem[]` |
| `booking_hanh_khach`    | `BookingHanhKhach[]`   |
| `booking_payment`       | `BookingPayments`      |

---

## API Backend (NestJS)

### Endpoints

| Method | Route                  | Mô tả                               | Permission         |
| ------ | ---------------------- | ----------------------------------- | ------------------ |
| GET    | `/bookings/phan-trang` | Phân trang + filter                 | `VIEW_BOOKING`     |
| GET    | `/bookings/thong-ke`   | Thống kê theo trạng thái, doanh thu | `VIEW_BOOKING`     |
| GET    | `/bookings/:id`        | Chi tiết booking                    | `VIEW_BOOKING`     |
| POST   | `/bookings`            | Tạo booking mới                     | `BOOKING_CREATE`   |
| PATCH  | `/bookings/:id`        | Cập nhật booking                    | `UPDATE_BOOKING`   |
| DELETE | `/bookings/:id`        | Xoá (soft delete nếu entity hỗ trợ) | `DELETE_BOOKING`   |

> **Lưu ý thứ tự route:** Đặt route cụ thể (`/phan-trang`, `/thong-ke`) **trước** route param (`:id`) để tránh conflict.

### Filter phân trang (`BookingListQueryDto`)

| Filter              | Kiểu       | Mô tả                              |
| ------------------- | ---------- | ----------------------------------- |
| `trang_thai`        | enum       | Trạng thái booking                  |
| `tau_thuyen_id`     | UUID       | Theo tàu                            |
| `tu_ngay`           | date       | Ngày đi từ                          |
| `den_ngay`          | date       | Ngày đi đến                         |
| `ht_ma_hanh_trinh`  | text[]     | Mã hành trình (array overlap)       |
| `keyword`           | string     | Tìm `ma_dat_cho`, `nguoi_tao`      |

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
  "ma_dat_cho": "BK-2026-001",
  "lien_ket": "abc123",
  "trang_thai": "da_duyet",
  "nguon_dat_cho": "nhan_vien_ban_ve",
  "ngay_di": "2026-06-01T08:00:00Z",
  "ngay_ve": "2026-06-01T17:00:00Z",
  "th_tong_khach_viet_nam": 10,
  "th_tong_khach_nuoc_ngoai": 2,
  "th_tong_so_khach": 12,
  "th_tong_tien": 1500000,
  "nguoi_tao": "admin@example.com",
  "ngay_tao": "2026-05-26T10:00:00Z",
  "tau_thuyen": { "id": "...", "ten_tau": "...", "ma_tau": "..." },
  "booking_hanh_khach": [],
  "booking_file_dinh_kem": []
}
```

---

## Model & Enum

### Entity `Bookings` (bảng `bookings`)

#### Định danh & liên kết

| Trường          | Kiểu         | Bắt buộc | Mô tả                                |
| --------------- | ------------ | -------- | ------------------------------------- |
| `id`            | UUID (v7)    | ✅       | PK, auto `uuid_generate_v7()`         |
| `ma_dat_cho`    | varchar(50)  | ✅       | Mã đặt chỗ, unique                    |
| `lien_ket`      | varchar(128) |          | Chuỗi mã hoá cho URL công khai        |
| `tau_thuyen_id` | UUID         | ✅       | FK → tàu thuyền                       |
| `tenant_code`   | varchar      | ✅       | Mã tenant (multi-tenant)              |
| `diem_xu_ly_id` | UUID         |          | FK → cảng bán / điểm xử lý            |

#### Lịch trình

| Trường             | Kiểu      | Bắt buộc | Mô tả                     |
| ------------------ | --------- | -------- | -------------------------- |
| `ngay_di`          | timestamp | ✅       | Ngày/giờ đi                |
| `ngay_ve`          | timestamp |          | Ngày/giờ về (nullable)     |
| `ht_ma_hanh_trinh` | text[]    |          | Mã hành trình (PG array)  |

#### Số lượng khách

| Trường                     | Kiểu | Default | Mô tả                 |
| -------------------------- | ---- | ------- | ---------------------- |
| `th_tong_khach_viet_nam`   | int  | 0       | Tổng khách Việt Nam    |
| `th_tong_khach_nuoc_ngoai` | int  | 0       | Tổng khách nước ngoài  |
| `th_tong_so_khach`         | int  | 0       | = VN + nước ngoài      |
| `loai_khach`               | varchar |      | Loại khách (nullable)  |

#### Trạng thái & nguồn

| Trường           | Kiểu                       | Default            | Mô tả              |
| ---------------- | -------------------------- | ------------------ | ------------------- |
| `trang_thai`     | enum `BookingTrangThai`    | `ban_nhap`         | Trạng thái booking  |
| `nguon_dat_cho`  | enum `BookingNguonDatCho`  | `nhan_vien_ban_ve` | Nguồn tạo đặt chỗ  |
| `nguon_tinh_gia` | enum `BookingNguonTinhGia` |                    | Nguồn tính giá      |
| `meta_data`      | jsonb                      |                    | Payload bổ sung     |

#### Tài chính & xử lý

| Trường            | Kiểu          | Mô tả                   |
| ----------------- | ------------- | ------------------------ |
| `th_tong_tien`    | decimal(15,2) | Tổng tiền                |
| `ghi_chu`         | text          | Ghi chú                  |
| `nguoi_tao`       | varchar(100)  | Người tạo                |
| `nhan_vien_xu_ly` | UUID          | FK → nhân viên xử lý     |
| `thoi_gian_xu_ly` | timestamptz   | Thời điểm xử lý          |
| `tt_xuat_hoa_don` | varchar       | Trạng thái xuất hóa đơn  |

#### Thuyền trưởng & thuyền viên

| Trường                           | Kiểu         | Mô tả                |
| -------------------------------- | ------------ | -------------------- |
| `tt_ten_thuyen_truong`           | varchar(200) | Tên thuyền trưởng    |
| `tt_so_giay_phep_lai_tau`        | varchar(50)  | Số giấy phép lái tàu |
| `tt_so_dien_thoai_thuyen_truong` | varchar(20)  | SĐT thuyền trưởng    |
| `tt_so_luong_thuyen_vien`        | int          | Số lượng thuyền viên  |
| `tt_so_luong_nhan_vien_phuc_vu`  | int          | Số lượng NV phục vụ   |

#### Audit

| Trường          | Kiểu        | Mô tả                    |
| --------------- | ----------- | ------------------------- |
| `ngay_tao`      | timestamptz | Auto `@CreateDateColumn`  |
| `ngay_cap_nhat` | timestamptz | Auto `@UpdateDateColumn`  |

### Enum `BookingTrangThai`

```
ban_nhap | da_gui | chua_duyet | da_duyet | bi_tu_choi
da_thanh_toan | dang_in | da_in | in_loi | hoan_thanh | da_huy | da_xoa
gui_lai | mua_them | tu_choi_mua_them | gui_lai_mua_them | duyet_mua_them
huy_mua_them | dang_them_khach | da_chot
```

**Nhóm trạng thái UI (dùng cho badge màu + filter):**

| Nhóm            | Giá trị                                            |
| --------------- | -------------------------------------------------- |
| Nháp            | `ban_nhap`                                         |
| Chờ duyệt      | `da_gui`, `gui_lai`, `chua_duyet`                  |
| Đã duyệt       | `da_duyet`, `da_chot`                              |
| Từ chối         | `bi_tu_choi`                                       |
| Thanh toán / in | `da_thanh_toan`, `dang_in`, `da_in`, `in_loi`      |
| Hoàn tất / huỷ | `hoan_thanh`, `da_huy`, `da_xoa`                   |
| Mua thêm        | `mua_them`, `dang_them_khach`, `duyet_mua_them`, … |

### Enum `BookingNguonDatCho`

```
chu_tau | nhan_vien_ban_ve | api
```

### Enum `BookingNguonTinhGia`

```
none | hanh_khach | excel | nhap_nhanh | mua_them_ve | mua_them_thu_cong
mua_them_excel | link
```

---

## DTO & Validation

### DTO classes

| Class               | Method | Mô tả                                                                                                  |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------- |
| `CreateBookingsDto` | POST   | Bắt buộc: `ma_dat_cho`, `tau_thuyen_id`, `hanh_trinh_id`, `thoi_gian_khoi_hanh`, `ngay_di`, `tong_khach_viet_nam`, `tong_khach_nuoc_ngoai`, `loai_dat_cho`, `nguoi_tao` |
| `UpdateBookingsDto` | PATCH  | Tất cả field optional (PartialType)                                                                      |
| `SearchBookingsDto` | GET    | Filter: `trang_thai`, `loai_dat_cho`, `tau_thuyen_id`, `hanh_trinh_id`, `ngay_di_tu`, `ngay_di_den`, `nguoi_tao`, `keyword` |

### DTO ↔ Entity mapping

| DTO (`CreateBookingsDto`)     | Entity (`Bookings`)              | Ghi chú                                     |
| ----------------------------- | -------------------------------- | -------------------------------------------- |
| `ma_dat_cho`                  | `ma_dat_cho`                     |                                              |
| `tau_thuyen_id`               | `tau_thuyen_id`                  | DTO: number → entity: UUID string            |
| `hanh_trinh_id`               | `ht_ma_hanh_trinh`              | Entity là array — wrap `[hanh_trinh_id]`      |
| `goi_ve_id`                   | —                                | Lưu trong `meta_data`                        |
| `thoi_gian_khoi_hanh`         | `ngay_di`                        | Map datetime                                 |
| `ngay_di`                     | `ngay_di`                        |                                              |
| `ngay_ve`                     | `ngay_ve`                        |                                              |
| `gio_khoi_hanh`               | —                                | Merge vào `ngay_di` hoặc `meta_data`         |
| `gio_ve_du_kien`              | —                                | Merge vào `ngay_ve` hoặc `meta_data`         |
| `tong_khach_viet_nam`         | `th_tong_khach_viet_nam`         |                                              |
| `tong_khach_nuoc_ngoai`       | `th_tong_khach_nuoc_ngoai`       |                                              |
| —                             | `th_tong_so_khach`               | Tự tính = VN + nước ngoài                    |
| `trang_thai`                  | `trang_thai`                     | DTO: `BookingStatus`, entity: `BookingTrangThai` |
| `loai_dat_cho`                | `nguon_dat_cho`                  | **Tên khác nhau** — map khi persist          |
| `nguoi_tao`                   | `nguoi_tao`                      |                                              |
| `ghi_chu`                     | `ghi_chu`                        |                                              |
| `tong_tien_cuoi_cung`         | `th_tong_tien`                   |                                              |
| `ten_thuyen_truong`           | `tt_ten_thuyen_truong`           |                                              |
| `so_giay_phep_lai_tau`        | `tt_so_giay_phep_lai_tau`        |                                              |
| `so_dien_thoai_thuyen_truong` | `tt_so_dien_thoai_thuyen_truong` |                                              |
| `so_luong_thuyen_vien`        | `tt_so_luong_thuyen_vien`        |                                              |
| `so_luong_nhan_vien_phuc_vu`  | `tt_so_luong_nhan_vien_phuc_vu`  |                                              |
| `tuyen_van_chuyen`            | —                                | Lưu `meta_data` hoặc `ht_ma_hanh_trinh`     |

### Quy tắc validation

- Đặt DTO trong `packages/shared/src/dto/bookings/`
- Dùng `class-validator`, message **tiếng Việt**
- Validate tại controller boundary trước khi gọi service
- Tự tính `th_tong_so_khach` = `th_tong_khach_viet_nam` + `th_tong_khach_nuoc_ngoai` khi tạo/cập nhật

---

## Cấu trúc file

```
apps/api/src/bookings/
├── bookings.controller.ts          # Thin controller — delegate sang service
├── bookings.service.ts             # Business logic, enrich hành khách, scope chủ tàu
└── bookings.module.ts              # DI, withNextAuthMiddleware

packages/api-models/src/
├── entity/bookings.entity.ts       # Schema — không đổi trừ khi cần
├── data-access/bookings.repository.ts  # Query, pagination, filter
└── types/booking.ts                # Enum BookingTrangThai, BookingNguonDatCho, …

packages/shared/src/dto/bookings/
├── bookings-core.dto.ts            # Create / Update / Search DTO
└── index.ts                        # Re-export

apps/web/app/(admin)/quan-ly-booking/
├── page.tsx                        # Re-export BookingListPage
├── booking-list.tsx                # Bảng + filter + thống kê
└── booking-detail-dialog.tsx       # Dialog chi tiết booking

packages/permissions/src/
└── permissions/pm1.permission.ts   # Tham chiếu key — không đổi
```

**Không sửa:** `node_modules/`, `.turbo/`, migration cũ, package không liên quan.

**Phụ thuộc external** (mock/stub nếu thiếu trong repo): `@ac/api-common`, `src/core`.

---

## Lưu ý kỹ thuật

- Controller thin — mọi logic trong service/repository
- Module wrap `withNextAuthMiddleware(_BookingsModule, "bookings")`
- Service scope `REQUEST` khi cần email user (endpoint chủ tàu)
- Bảng dùng `DataTable` + `useEnhancedTable` từ `@workspace/ui`
- Columns dùng `createColumnHelper<BookingItem>()`
- Phân trang server-side: `skip` / `take` qua `BookingListQueryDto` + `applyListQueryFilters`
- Selective joins — không over-fetch relations
- Batch load hành khách — `IN` query, không loop N+1
- Swagger `@ApiOperation` / `@ApiResponse` trên mọi endpoint
- `NotFoundException` cho resource không tồn tại
- Giữ naming snake_case cho field DB/API domain
- Không hardcode secret / DB credential

---

## Tiêu chí hoàn thành

### Backend

- [ ] Controller thin — logic trong service/repository
- [ ] Pagination + filter qua `BookingListQueryDto` + `applyListQueryFilters`
- [ ] Selective joins — không over-fetch relations
- [ ] Batch load hành khách — `IN` query, không loop
- [ ] DTO shared + validation tiếng Việt
- [ ] Swagger `@ApiOperation` / `@ApiResponse` trên mọi endpoint
- [ ] `NotFoundException` cho resource không tồn tại

### Frontend

- [ ] Bảng danh sách với filter + phân trang server-side
- [ ] Thống kê summary cards phía trên bảng
- [ ] Dialog chi tiết booking
- [ ] Badge trạng thái có màu theo nhóm
- [ ] Kiểm tra permission trước khi render
