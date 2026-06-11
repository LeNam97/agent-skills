import { Injectable } from "@nestjs/common";
import {
  applyListQueryFilters,
  type ApplyListQueryFiltersOptions,
  type ListQueryFilterConfig,
} from "@ac/api-common";
import { DataSource, In, Repository, SelectQueryBuilder } from "typeorm";
import { Bookings } from "../entity/bookings.entity";
import { BookingTrangThai } from "../types/booking";
export interface TauThuyenListQueryParams {
  page?: number;
  pageSize?: number;
  trang_thai?: BookingTrangThai[];
  tau_thuyen_id?: string;
  tu_ngay?: Date;
  den_ngay?: Date;
  ht_ma_hanh_trinh?: string[];
  keyword?: string;
  /** Khi set — chỉ booking thuộc tàu có email chủ tàu khớp (scope chủ tàu) */
  chu_tau_email?: string;
  include_deleted?: boolean;
}

export interface TauThuyenPaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TauThuyenThongKe {
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

const listFilterOptions: ApplyListQueryFiltersOptions<TauThuyenListQueryParams> =
  {
    excludeDeleted: {
      column: "booking.trang_thai",
      value: BookingTrangThai.DA_XOA,
    },
    actorScope: {
      paramKey: "chu_tau_email",
      dbColumn: "tau_thuyen.email",
    },
  };

@Injectable()
export class TauThuyenRepository extends Repository<Bookings> {
  constructor(private dataSource: DataSource) {
    super(Bookings, dataSource.createEntityManager());
  }

  async findPaginated(
    params: TauThuyenListQueryParams
  ): Promise<TauThuyenPaginatedResult<Bookings>> {
    const { page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;

    const qb = this.createQueryBuilder("booking");

    this.joinTauThuyen(qb);
    applyListQueryFilters(qb, params, listFilterConfig, listFilterOptions);

    qb.orderBy("booking.ngay_tao", "DESC");
    qb.skip(skip).take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, pageSize };
  }

  async findByIdWithRelations(
    id: string,
    scope?: { chu_tau_email?: string }
  ): Promise<Bookings | null> {
    const qb = this.createQueryBuilder("booking");

    this.joinTauThuyen(qb, { includeSucChua: true });

    qb.where("booking.id = :id", { id });

    if (scope?.chu_tau_email) {
      qb.andWhere("tau_thuyen.email = :chu_tau_email", {
        chu_tau_email: scope.chu_tau_email,
      });
    }

    return qb.getOne();
  }

  async findByIds(ids: string[]): Promise<Bookings[]> {
    if (ids.length === 0) return [];
    return this.find({ where: { id: In(ids) } });
  }

  async getThongKe(
    params: Omit<TauThuyenListQueryParams, "page" | "pageSize">
  ): Promise<TauThuyenThongKe[]> {
    const qb = this.createQueryBuilder("booking");

    this.joinTauThuyen(qb);

    qb.select("booking.trang_thai", "trang_thai")
      .addSelect("COUNT(*)::int", "so_luong")
      .addSelect("COALESCE(SUM(booking.th_tong_tien), 0)", "tong_tien");

    applyListQueryFilters(qb, params, listFilterConfig, listFilterOptions);

    qb.groupBy("booking.trang_thai");

    return qb.getRawMany();
  }

  async markAsDeleted(id: string): Promise<boolean> {
    const result = await this.update(id, {
      trang_thai: BookingTrangThai.DA_XOA,
    });
    return (result.affected ?? 0) > 0;
  }

  private joinTauThuyen(
    qb: SelectQueryBuilder<Bookings>,
    options?: { includeSucChua?: boolean }
  ): void {
    const tauColumns = [
      "tau_thuyen.id",
      "tau_thuyen.ten_tau",
      "tau_thuyen.ma_tau",
      ...(options?.includeSucChua ? ["tau_thuyen.suc_chua_toi_da"] : []),
    ];

    qb.leftJoin("booking.tau_thuyen", "tau_thuyen").addSelect(tauColumns);
  }
}
