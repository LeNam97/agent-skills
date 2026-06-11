# Tài liệu BA: Quản lý Tàu thuyền

> **Module:** Quản lý đặt chỗ (Tàu thuyền)
> **Hệ thống:** E-ticket du lịch biển
> **Entity:** `packages/api-models/src/entity/tau-thuyen.entity.ts`

## Skill Sử dụng

- .cursor/skills/caveman

## Actors

| Actor   | Mô tả                                         |
| ------- | --------------------------------------------- |
| Admin   | Toàn quyền CRUD                               |
| Chủ tàu | Chỉ xem booking của tàu mình (scope by email) |

## Danh sách chức năng

1. **Xem danh sách** — bảng phân trang + filter + thống kê tổng quan
2. **Xem chi tiết** — dialog hiển thị đầy đủ thông tin booking
3. **Tạo mới** — form tạo booking
4. **Sửa** — form chỉnh sửa booking
5. **Xoá** — soft delete
6. **Duyệt** — chuyển trạng thái booking (chờ duyệt → đã duyệt / từ chối)

## Màn hình danh sách

### Cột bảng

| Cột        | Ghi chú                      |
| ---------- | ---------------------------- |
| STT        |                              |
| Mã đặt chỗ | Link tới chi tiết            |
| Tàu        | Tên tàu                      |
| Ngày đi    |                              |
| Ngày về    |                              |
| Tổng khách | Tách VN / nước ngoài nếu cần |
| Tổng tiền  | Format VNĐ                   |
| Trạng thái | Badge màu theo nhóm          |
| Người tạo  |                              |
| Ngày tạo   |                              |
| Thao tác   | Xem / Sửa / Xoá tuỳ quyền    |

### Bộ lọc

- Keyword (mã đặt chỗ, người tạo)
- Trạng thái (multi-select)
- Tàu thuyền (dropdown)
- Hành trình (dropdown)
- Ngày đi (khoảng ngày)

### Thống kê (cards phía trên bảng)

- Tổng booking
- Số chờ duyệt
- Số đã duyệt
- Tổng doanh thu (booking đã duyệt)

## Màn hình chi tiết

Chia thành các nhóm:

- **Thông tin chung:** mã đặt chỗ, trạng thái, nguồn đặt chỗ, ngày đi/về, hành trình, ghi chú
- **Thông tin tàu:** tên tàu, mã tàu, sức chứa
- **Thuyền trưởng & thuyền viên:** tên, giấy phép, SĐT, số lượng thuyền viên/NV phục vụ
- **Khách & tài chính:** tổng khách VN, nước ngoài, tổng tiền
- **Danh sách hành khách:** sub-table (bản nháp dùng bảng draft, còn lại dùng bảng chính thức)

## Business rules

- Chủ tàu chỉ xem được booking có `tau_thuyen` thuộc sở hữu (match email đăng nhập)
- `th_tong_so_khach` tự tính = khách VN + khách nước ngoài
- Trạng thái mặc định khi tạo: `ban_nhap`
