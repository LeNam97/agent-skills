import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsDateString,
  IsEnum,
  IsArray,
  Min,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";

export enum BookingStatus {
  BAN_NHAP = "ban_nhap",
  DA_GUI = "da_gui",
  CHUA_DUYET = "chua_duyet",
  DA_DUYET = "da_duyet",
  BI_TU_CHOI = "bi_tu_choi",
  DA_THANH_TOAN = "da_thanh_toan",
  DANG_IN = "dang_in",
  DA_IN = "da_in",
  IN_LOI = "in_loi",
  HOAN_THANH = "hoan_thanh",
  DA_HUY = "da_huy",
  DA_XOA = "da_xoa",
  GUI_LAI = "gui_lai",
  MUA_THEM = "mua_them",
  TU_CHOI_MUA_THEM = "tu_choi_mua_them",
  GUI_LAI_MUA_THEM = "gui_lai_mua_them",
  DUYET_MUA_THEM = "duyet_mua_them",
  HUY_MUA_THEM = "huy_mua_them",
  DANG_THEM_KHACH = "dang_them_khach",
  DA_CHOT = "da_chot",
}

export enum BookingNguonDatChoDto {
  CHU_TAU = "chu_tau",
  NHAN_VIEN_BAN_VE = "nhan_vien_ban_ve",
  API = "api",
}

export class CreateBookingsDto {
  @IsString({ message: "Mã đặt chỗ phải là chuỗi" })
  @IsNotEmpty({ message: "Mã đặt chỗ không được để trống" })
  @MaxLength(50, { message: "Mã đặt chỗ không được vượt quá 50 ký tự" })
  ma_dat_cho!: string;

  @IsUUID("all", { message: "ID tàu thuyền không hợp lệ" })
  @IsNotEmpty({ message: "ID tàu thuyền không được để trống" })
  tau_thuyen_id!: string;

  @IsString({ message: "Mã hành trình phải là chuỗi" })
  @IsNotEmpty({ message: "Mã hành trình không được để trống" })
  hanh_trinh_id!: string;

  @IsDateString({}, { message: "Thời gian khởi hành không hợp lệ" })
  @IsNotEmpty({ message: "Thời gian khởi hành không được để trống" })
  thoi_gian_khoi_hanh!: string;

  @IsDateString({}, { message: "Ngày đi không hợp lệ" })
  @IsNotEmpty({ message: "Ngày đi không được để trống" })
  ngay_di!: string;

  @IsOptional()
  @IsDateString({}, { message: "Ngày về không hợp lệ" })
  ngay_ve?: string;

  @IsOptional()
  @IsString({ message: "Giờ khởi hành phải là chuỗi" })
  gio_khoi_hanh?: string;

  @IsOptional()
  @IsString({ message: "Giờ về dự kiến phải là chuỗi" })
  gio_ve_du_kien?: string;

  @IsNumber({}, { message: "Tổng khách Việt Nam phải là số" })
  @Min(0, { message: "Tổng khách Việt Nam không được âm" })
  tong_khach_viet_nam!: number;

  @IsNumber({}, { message: "Tổng khách nước ngoài phải là số" })
  @Min(0, { message: "Tổng khách nước ngoài không được âm" })
  tong_khach_nuoc_ngoai!: number;

  @IsEnum(BookingNguonDatChoDto, {
    message: "Loại đặt chỗ không hợp lệ. Chấp nhận: chu_tau, nhan_vien_ban_ve, api",
  })
  @IsNotEmpty({ message: "Loại đặt chỗ không được để trống" })
  loai_dat_cho!: BookingNguonDatChoDto;

  @IsString({ message: "Người tạo phải là chuỗi" })
  @IsNotEmpty({ message: "Người tạo không được để trống" })
  @MaxLength(100, { message: "Người tạo không được vượt quá 100 ký tự" })
  nguoi_tao!: string;

  @IsOptional()
  @IsString({ message: "Ghi chú phải là chuỗi" })
  ghi_chu?: string;

  @IsOptional()
  @IsNumber({}, { message: "Tổng tiền cuối cùng phải là số" })
  @Min(0, { message: "Tổng tiền cuối cùng không được âm" })
  tong_tien_cuoi_cung?: number;

  @IsOptional()
  @IsString({ message: "Tên thuyền trưởng phải là chuỗi" })
  @MaxLength(200, { message: "Tên thuyền trưởng không được vượt quá 200 ký tự" })
  ten_thuyen_truong?: string;

  @IsOptional()
  @IsString({ message: "Số giấy phép lái tàu phải là chuỗi" })
  @MaxLength(50, { message: "Số giấy phép lái tàu không được vượt quá 50 ký tự" })
  so_giay_phep_lai_tau?: string;

  @IsOptional()
  @IsString({ message: "Số điện thoại thuyền trưởng phải là chuỗi" })
  @MaxLength(20, { message: "Số điện thoại thuyền trưởng không được vượt quá 20 ký tự" })
  so_dien_thoai_thuyen_truong?: string;

  @IsOptional()
  @IsNumber({}, { message: "Số lượng thuyền viên phải là số" })
  @Min(0, { message: "Số lượng thuyền viên không được âm" })
  so_luong_thuyen_vien?: number;

  @IsOptional()
  @IsNumber({}, { message: "Số lượng nhân viên phục vụ phải là số" })
  @Min(0, { message: "Số lượng nhân viên phục vụ không được âm" })
  so_luong_nhan_vien_phuc_vu?: number;

  @IsOptional()
  @IsString({ message: "Tenant code phải là chuỗi" })
  tenant_code?: string;
}

export class UpdateBookingsDto {
  @IsOptional()
  @IsUUID("all", { message: "ID tàu thuyền không hợp lệ" })
  tau_thuyen_id?: string;

  @IsOptional()
  @IsString({ message: "Mã hành trình phải là chuỗi" })
  hanh_trinh_id?: string;

  @IsOptional()
  @IsDateString({}, { message: "Ngày đi không hợp lệ" })
  ngay_di?: string;

  @IsOptional()
  @IsDateString({}, { message: "Ngày về không hợp lệ" })
  ngay_ve?: string;

  @IsOptional()
  @IsNumber({}, { message: "Tổng khách Việt Nam phải là số" })
  @Min(0, { message: "Tổng khách Việt Nam không được âm" })
  tong_khach_viet_nam?: number;

  @IsOptional()
  @IsNumber({}, { message: "Tổng khách nước ngoài phải là số" })
  @Min(0, { message: "Tổng khách nước ngoài không được âm" })
  tong_khach_nuoc_ngoai?: number;

  @IsOptional()
  @IsEnum(BookingStatus, {
    message: "Trạng thái booking không hợp lệ",
  })
  trang_thai?: BookingStatus;

  @IsOptional()
  @IsString({ message: "Ghi chú phải là chuỗi" })
  ghi_chu?: string;

  @IsOptional()
  @IsNumber({}, { message: "Tổng tiền cuối cùng phải là số" })
  @Min(0, { message: "Tổng tiền cuối cùng không được âm" })
  tong_tien_cuoi_cung?: number;

  @IsOptional()
  @IsString({ message: "Tên thuyền trưởng phải là chuỗi" })
  @MaxLength(200, { message: "Tên thuyền trưởng không được vượt quá 200 ký tự" })
  ten_thuyen_truong?: string;

  @IsOptional()
  @IsString({ message: "Số giấy phép lái tàu phải là chuỗi" })
  @MaxLength(50, { message: "Số giấy phép lái tàu không được vượt quá 50 ký tự" })
  so_giay_phep_lai_tau?: string;

  @IsOptional()
  @IsString({ message: "Số điện thoại thuyền trưởng phải là chuỗi" })
  @MaxLength(20, { message: "Số điện thoại thuyền trưởng không được vượt quá 20 ký tự" })
  so_dien_thoai_thuyen_truong?: string;

  @IsOptional()
  @IsNumber({}, { message: "Số lượng thuyền viên phải là số" })
  @Min(0, { message: "Số lượng thuyền viên không được âm" })
  so_luong_thuyen_vien?: number;

  @IsOptional()
  @IsNumber({}, { message: "Số lượng nhân viên phục vụ phải là số" })
  @Min(0, { message: "Số lượng nhân viên phục vụ không được âm" })
  so_luong_nhan_vien_phuc_vu?: number;
}

export class BookingListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "Số trang phải là số" })
  @Min(1, { message: "Số trang phải lớn hơn 0" })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "Kích thước trang phải là số" })
  @Min(1, { message: "Kích thước trang phải lớn hơn 0" })
  pageSize?: number;

  @IsOptional()
  @IsEnum(BookingStatus, { message: "Trạng thái không hợp lệ" })
  trang_thai?: BookingStatus;

  @IsOptional()
  @IsUUID("all", { message: "ID tàu thuyền không hợp lệ" })
  tau_thuyen_id?: string;

  @IsOptional()
  @IsDateString({}, { message: "Ngày bắt đầu không hợp lệ" })
  tu_ngay?: string;

  @IsOptional()
  @IsDateString({}, { message: "Ngày kết thúc không hợp lệ" })
  den_ngay?: string;

  @IsOptional()
  @IsArray({ message: "Mã hành trình phải là mảng" })
  @IsString({ each: true, message: "Mỗi mã hành trình phải là chuỗi" })
  ht_ma_hanh_trinh?: string[];

  @IsOptional()
  @IsString({ message: "Từ khóa phải là chuỗi" })
  keyword?: string;
}

export class ThongKeQueryDto {
  @IsOptional()
  @IsDateString({}, { message: "Ngày bắt đầu không hợp lệ" })
  tu_ngay?: string;

  @IsOptional()
  @IsDateString({}, { message: "Ngày kết thúc không hợp lệ" })
  den_ngay?: string;

  @IsOptional()
  @IsUUID("all", { message: "ID tàu thuyền không hợp lệ" })
  tau_thuyen_id?: string;
}
