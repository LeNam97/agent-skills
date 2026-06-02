# Prompt: Chức năng Quản lý Tài sản

> **Role:** BA → Dev
> **Route:** `apps/web/app/(admin)/quan-ly-tai-san/`
> **Data source:** PostgreSQL qua GraphQL (`notary` service)

---

## Mục tiêu

Màn hình tra cứu danh sách tài sản đã được công chứng trong hệ thống CSDLCC.
Người dùng có thể xem, lọc, tìm kiếm tài sản và xem chi tiết từng tài sản.

---

## Phân quyền

- Cần kiểm tra `permissionMap[PERMISSIONS.QUAN_LY_TAI_SAN_VIEW]` trước khi render
- Dùng `useUserStore` để lấy `permissionMap`

---

## Màn hình chính — Danh sách tài sản

### Thông tin hiển thị trên bảng (DataTable)

| Cột               | Field GraphQL                       | Ghi chú                            |
| ----------------- | ----------------------------------- | ---------------------------------- |
| STT               | _(tính theo trang)_                 |                                    |
| Loại tài sản      | `loaiTaiSanGiaoDichCC.ten`          | Dropdown filter                    |
| Số giấy tờ        | `soGiayTo`                          | Text search                        |
| Ngày cấp          | `ngayCap`                           | Date format `dd/MM/yyyy`           |
| Nơi cấp           | `noiCap`                            | Text search                        |
| Thông tin tài sản | `thongTinTimKiem`                   | Có thể dài — dùng `ExpandableText` |
| Số công chứng     | `taiSanHoSoCC.hoSoCC.soCongChung`   | Sortable                           |
| Ngày công chứng   | `taiSanHoSoCC.hoSoCC.ngayCongChung` | Sortable, date format              |
| Thao tác          | _(button xem chi tiết)_             | Icon `EyeIcon`                     |

### Bộ lọc & tìm kiếm

- **Keyword** — tìm theo `soGiayTo`, `chuSoHuu`, `thongTinTimKiem`
- **Loại tài sản** — dropdown từ `GetItemLoaiTaiSanGiaoDichCcList`
- **Ngày công chứng** — date range filter

---

## Dialog chi tiết tài sản

Hiển thị khi click "Xem chi tiết". File: `tai-san-detail-dialog.tsx`

### Thông tin chung

| Trường         | Field                      |
| -------------- | -------------------------- |
| Loại tài sản   | `loaiTaiSanGiaoDichCC.ten` |
| Chủ sở hữu     | `chuSoHuu`                 |
| Số giấy tờ     | `soGiayTo`                 |
| Ngày cấp       | `ngayCap`                  |
| Nơi cấp        | `noiCap`                   |
| Thông tin khác | `thongTinKhac`             |

### Thông tin chi tiết theo loại (hiển thị có điều kiện)

**BDS — Đất (`taiSanBDSDat`)**

| Trường        | Field        |
| ------------- | ------------ |
| Số vào sổ GCN | `soVaoSoGCN` |
| Thửa đất số   | `thuaDatSo`  |
| Tờ bản đồ số  | `toBanDoSo`  |
| Diện tích     | `dienTich`   |
| Mục đích      | `mucDich`    |
| Thời hạn      | `thoiHan`    |
| Địa chỉ       | `diaChi`     |

**Ô tô / Xe máy (`taiSanOtoXeMay`)**

| Trường       | Field        |
| ------------ | ------------ |
| Biển số      | `bienSo`     |
| Nhãn hiệu    | `nhanHieu`   |
| Màu sắc      | `mauSac`     |
| Số khung     | `soKhung`    |
| Số máy       | `soMay`      |
| Năm sản xuất | `namSanXuat` |

> Các loại tài sản khác (tàu biển, tàu cá, tàu bay, sổ tiết kiệm, cổ phiếu, trái phiếu) hiển thị tương tự — chỉ render section khi field tương ứng khác `null`.

### Thông tin hồ sơ công chứng liên quan

| Trường             | Field                                     |
| ------------------ | ----------------------------------------- |
| Số công chứng      | `taiSanHoSoCC.hoSoCC.soCongChung`         |
| Ngày công chứng    | `taiSanHoSoCC.hoSoCC.ngayCongChung`       |
| Tổ chức công chứng | `taiSanHoSoCC.hoSoCC.toChucCongChung.ten` |

---

## Cấu trúc file (theo rules dự án)

```
app/(admin)/quan-ly-tai-san/
├── page.tsx                        # Điểm vào — re-export QuanLyTaiSanPage
├── quan-ly-tai-san-list.tsx        # Component chính: bảng + filter + thống kê
└── tai-san-detail-dialog.tsx       # Dialog chi tiết tài sảnx

constants/
└── tai-san.enums.ts                # LoaiTaiSan enum + label map
```

## Lưu ý kỹ thuật

- Bảng dùng `DataTable` + `useEnhancedTable` từ `@workspace/ui`
- Columns dùng `createColumnHelper<TaiSanItem>()`
- Gọi data qua `useQuery` (TanStack Query) + Apollo Client
- Trường `thongTinTimKiem` là full-text search index phía backend — dùng làm keyword filter
- Phân trang server-side: `skip` / `take`
