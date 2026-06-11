import { Injectable } from "@nestjs/common";
import {
  applyListQueryFilters,
  type ListQueryFilterConfig,
} from "@ac/api-common";
import { DataSource, Repository, SelectQueryBuilder, In } from "typeorm";
import { Bookings } from "../entity/bookings.entity";
import { BookingTrangThai } from "../types/booking";
export interface BookingListQueryParams {
  page?: number;
  pageSize?: number;
  trang_thai?: BookingTrangThai;
  tau_thuyen_id?: string;
  tu_ngay?: Date;
  den_ngay?: Date;
  ht_ma_hanh_trinh?: string[];
  keyword?: string;
  chu_tau_email?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BookingThongKe {
  trang_thai: BookingTrangThai;
  so_luong: number;
  tong_tien: number;
}

const listFilterConfig: ListQueryFilterConfig = {
  keyword: {
    columns: ["booking.ma_dat_cho", "booking.nguoi_tao"],
  },
  columns: [
    { paramKey: "trang_thai", dbColumn: "booking.trang_thai", compare: "in" },
    { paramKey: "tau_thuyen_id", dbColumn: "booking.tau_thuyen_id", compare: "eq" },
    { paramKey: "tu_ngay", dbColumn: "booking.ngay_di", compare: "gte" },
    { paramKey: "den_ngay", dbColumn: "booking.ngay_di", compare: "lte" },
    {
      paramKey: "ht_ma_hanh_trinh",
      dbColumn: "booking.ht_ma_hanh_trinh",
      compare: "array-overlap",
    },
  ],
};

@Injectable()
export class BookingsRepository extends Repository<Bookings> {
  constructor(private dataSource: DataSource) {
    super(Bookings, dataSource.createEntityManager());
  }

  async findPaginated(
    params: BookingListQueryParams
  ): Promise<PaginatedResult<Bookings>> {
    const { page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;

    const qb = this.createQueryBuilder("booking");

    applyListQueryFilters(qb, params, listFilterConfig);

    qb.leftJoin("booking.tau_thuyen", "tau_thuyen")
      .addSelect(["tau_thuyen.id", "tau_thuyen.ten_tau", "tau_thuyen.ma_tau"]);

    qb.orderBy("booking.ngay_tao", "DESC");
    qb.skip(skip).take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, pageSize };
  }

  async findByIdWithRelations(id: string): Promise<Bookings | null> {
    const qb = this.createQueryBuilder("booking");

    qb.leftJoin("booking.tau_thuyen", "tau_thuyen")
      .addSelect([
        "tau_thuyen.id",
        "tau_thuyen.ten_tau",
        "tau_thuyen.ma_tau",
        "tau_thuyen.suc_chua_toi_da",
      ]);

    qb.leftJoin("tau_thuyen.chu_tau", "chu_tau")
      .addSelect(["chu_tau.id", "chu_tau.email", "chu_tau.ho_ten"]);

    qb.leftJoin("booking.nhan_vien_xu_ly_info", "nhan_vien")
      .addSelect(["nhan_vien.id", "nhan_vien.ten_dang_nhap", "nhan_vien.email"]);

    qb.where("booking.id = :id", { id });

    return qb.getOne();
  }

  async findByIds(ids: string[]): Promise<Bookings[]> {
    if (ids.length === 0) return [];
    return this.find({ where: { id: In(ids) } });
  }

  async getThongKe(params: {
    tu_ngay?: Date;
    den_ngay?: Date;
    tau_thuyen_id?: string;
  }): Promise<BookingThongKe[]> {
    const qb = this.createQueryBuilder("booking");

    qb.select("booking.trang_thai", "trang_thai")
      .addSelect("COUNT(*)::int", "so_luong")
      .addSelect("COALESCE(SUM(booking.th_tong_tien), 0)", "tong_tien");

    applyListQueryFilters(qb, params, listFilterConfig);

    qb.groupBy("booking.trang_thai");

    return qb.getRawMany();
  }

  async markAsDeleted(id: string): Promise<boolean> {
    const result = await this.update(id, {
      trang_thai: BookingTrangThai.DA_XOA,
    });
    return (result.affected ?? 0) > 0;
  }

}
