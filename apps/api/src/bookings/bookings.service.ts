import { Injectable, NotFoundException } from "@nestjs/common";
import {
  BookingsRepository,
  BookingListQueryParams,
  PaginatedResult,
  BookingThongKe,
} from "@ac/api-models";
import { Bookings, BookingTrangThai, BookingNguonDatCho } from "@ac/api-models";
import {
  CreateBookingsDto,
  UpdateBookingsDto,
  BookingListQueryDto,
  ThongKeQueryDto,
  BookingStatus,
  BookingNguonDatChoDto,
} from "@workspace/shared";

@Injectable()
export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  async findPaginated(
    query: BookingListQueryDto
  ): Promise<PaginatedResult<Bookings>> {
    const params: BookingListQueryParams = {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
      trang_thai: query.trang_thai
        ? this.mapDtoStatusToEntity(query.trang_thai)
        : undefined,
      tau_thuyen_id: query.tau_thuyen_id,
      tu_ngay: query.tu_ngay ? new Date(query.tu_ngay) : undefined,
      den_ngay: query.den_ngay ? new Date(query.den_ngay) : undefined,
      ht_ma_hanh_trinh: query.ht_ma_hanh_trinh,
      keyword: query.keyword,
    };

    return this.bookingsRepository.findPaginated(params);
  }

  async findById(id: string): Promise<Bookings> {
    const booking = await this.bookingsRepository.findByIdWithRelations(id);

    if (!booking) {
      throw new NotFoundException(`Không tìm thấy booking với ID: ${id}`);
    }

    return booking;
  }

  async create(dto: CreateBookingsDto): Promise<Bookings> {
    const entity = this.mapCreateDtoToEntity(dto);

    entity.th_tong_so_khach =
      entity.th_tong_khach_viet_nam + entity.th_tong_khach_nuoc_ngoai;

    return this.bookingsRepository.save(entity);
  }

  async update(id: string, dto: UpdateBookingsDto): Promise<Bookings> {
    const existing = await this.findById(id);

    const updatedEntity = this.mapUpdateDtoToEntity(existing, dto);

    if (
      dto.tong_khach_viet_nam !== undefined ||
      dto.tong_khach_nuoc_ngoai !== undefined
    ) {
      updatedEntity.th_tong_so_khach =
        updatedEntity.th_tong_khach_viet_nam +
        updatedEntity.th_tong_khach_nuoc_ngoai;
    }

    return this.bookingsRepository.save(updatedEntity);
  }

  async softDelete(id: string): Promise<void> {
    const existing = await this.findById(id);

    const deleted = await this.bookingsRepository.markAsDeleted(existing.id);

    if (!deleted) {
      throw new NotFoundException(`Không thể xoá booking với ID: ${id}`);
    }
  }

  async getThongKe(query: ThongKeQueryDto): Promise<BookingThongKe[]> {
    return this.bookingsRepository.getThongKe({
      tu_ngay: query.tu_ngay ? new Date(query.tu_ngay) : undefined,
      den_ngay: query.den_ngay ? new Date(query.den_ngay) : undefined,
      tau_thuyen_id: query.tau_thuyen_id,
    });
  }

  private mapDtoStatusToEntity(status: BookingStatus): BookingTrangThai {
    return status as unknown as BookingTrangThai;
  }

  private mapDtoNguonDatChoToEntity(
    nguon: BookingNguonDatChoDto
  ): BookingNguonDatCho {
    const mapping: Record<BookingNguonDatChoDto, BookingNguonDatCho> = {
      [BookingNguonDatChoDto.CHU_TAU]: BookingNguonDatCho.CHU_TAU,
      [BookingNguonDatChoDto.NHAN_VIEN_BAN_VE]: BookingNguonDatCho.NHAN_VIEN_BAN_VE,
      [BookingNguonDatChoDto.API]: BookingNguonDatCho.API,
    };
    return mapping[nguon];
  }

  private mapCreateDtoToEntity(dto: CreateBookingsDto): Bookings {
    const entity = new Bookings();

    entity.ma_dat_cho = dto.ma_dat_cho;
    entity.tau_thuyen_id = dto.tau_thuyen_id;
    entity.ht_ma_hanh_trinh = dto.hanh_trinh_id ? [dto.hanh_trinh_id] : [];
    entity.ngay_di = new Date(dto.ngay_di);
    entity.ngay_ve = dto.ngay_ve ? new Date(dto.ngay_ve) : undefined;
    entity.th_tong_khach_viet_nam = dto.tong_khach_viet_nam;
    entity.th_tong_khach_nuoc_ngoai = dto.tong_khach_nuoc_ngoai;
    entity.nguon_dat_cho = this.mapDtoNguonDatChoToEntity(dto.loai_dat_cho);
    entity.nguoi_tao = dto.nguoi_tao;
    entity.ghi_chu = dto.ghi_chu;
    entity.th_tong_tien = dto.tong_tien_cuoi_cung;
    entity.tt_ten_thuyen_truong = dto.ten_thuyen_truong;
    entity.tt_so_giay_phep_lai_tau = dto.so_giay_phep_lai_tau;
    entity.tt_so_dien_thoai_thuyen_truong = dto.so_dien_thoai_thuyen_truong;
    entity.tt_so_luong_thuyen_vien = dto.so_luong_thuyen_vien;
    entity.tt_so_luong_nhan_vien_phuc_vu = dto.so_luong_nhan_vien_phuc_vu;
    entity.tenant_code = dto.tenant_code ?? "default";
    entity.trang_thai = BookingTrangThai.BAN_NHAP;

    if (dto.gio_khoi_hanh || dto.gio_ve_du_kien) {
      entity.meta_data = {
        gio_khoi_hanh: dto.gio_khoi_hanh,
        gio_ve_du_kien: dto.gio_ve_du_kien,
      };
    }

    return entity;
  }

  private mapUpdateDtoToEntity(
    existing: Bookings,
    dto: UpdateBookingsDto
  ): Bookings {
    if (dto.tau_thuyen_id !== undefined) {
      existing.tau_thuyen_id = dto.tau_thuyen_id;
    }
    if (dto.hanh_trinh_id !== undefined) {
      existing.ht_ma_hanh_trinh = [dto.hanh_trinh_id];
    }
    if (dto.ngay_di !== undefined) {
      existing.ngay_di = new Date(dto.ngay_di);
    }
    if (dto.ngay_ve !== undefined) {
      existing.ngay_ve = new Date(dto.ngay_ve);
    }
    if (dto.tong_khach_viet_nam !== undefined) {
      existing.th_tong_khach_viet_nam = dto.tong_khach_viet_nam;
    }
    if (dto.tong_khach_nuoc_ngoai !== undefined) {
      existing.th_tong_khach_nuoc_ngoai = dto.tong_khach_nuoc_ngoai;
    }
    if (dto.trang_thai !== undefined) {
      existing.trang_thai = this.mapDtoStatusToEntity(dto.trang_thai);
    }
    if (dto.ghi_chu !== undefined) {
      existing.ghi_chu = dto.ghi_chu;
    }
    if (dto.tong_tien_cuoi_cung !== undefined) {
      existing.th_tong_tien = dto.tong_tien_cuoi_cung;
    }
    if (dto.ten_thuyen_truong !== undefined) {
      existing.tt_ten_thuyen_truong = dto.ten_thuyen_truong;
    }
    if (dto.so_giay_phep_lai_tau !== undefined) {
      existing.tt_so_giay_phep_lai_tau = dto.so_giay_phep_lai_tau;
    }
    if (dto.so_dien_thoai_thuyen_truong !== undefined) {
      existing.tt_so_dien_thoai_thuyen_truong = dto.so_dien_thoai_thuyen_truong;
    }
    if (dto.so_luong_thuyen_vien !== undefined) {
      existing.tt_so_luong_thuyen_vien = dto.so_luong_thuyen_vien;
    }
    if (dto.so_luong_nhan_vien_phuc_vu !== undefined) {
      existing.tt_so_luong_nhan_vien_phuc_vu = dto.so_luong_nhan_vien_phuc_vu;
    }

    return existing;
  }
}
