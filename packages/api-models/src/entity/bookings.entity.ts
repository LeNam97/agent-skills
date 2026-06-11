import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {
  BookingTrangThai,
  BookingNguonDatCho,
  BookingNguonTinhGia,
} from "../types/booking";
import { TauThuyen } from "./tau-thuyen.entity";

@Entity("bookings", { synchronize: false })
export class Bookings {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "ma_dat_cho", type: "varchar", length: 50, unique: true })
  ma_dat_cho!: string;

  @Column({ name: "lien_ket", type: "varchar", length: 128, nullable: true })
  lien_ket?: string;

  @Column({ name: "tau_thuyen_id", type: "uuid" })
  tau_thuyen_id!: string;

  @ManyToOne(() => TauThuyen, { createForeignKeyConstraints: false })
  @JoinColumn({ name: "tau_thuyen_id" })
  tau_thuyen?: TauThuyen;

  @Column({ name: "tenant_code", type: "varchar" })
  tenant_code!: string;

  @Column({ name: "diem_xu_ly_id", type: "uuid", nullable: true })
  diem_xu_ly_id?: string;

  @Column({ name: "ngay_di", type: "timestamp" })
  ngay_di!: Date;

  @Column({ name: "ngay_ve", type: "timestamp", nullable: true })
  ngay_ve?: Date;

  @Column({
    name: "ht_ma_hanh_trinh",
    type: "text",
    array: true,
    nullable: true,
  })
  ht_ma_hanh_trinh?: string[];

  @Column({ name: "th_tong_khach_viet_nam", type: "int", default: 0 })
  th_tong_khach_viet_nam!: number;

  @Column({ name: "th_tong_khach_nuoc_ngoai", type: "int", default: 0 })
  th_tong_khach_nuoc_ngoai!: number;

  @Column({ name: "th_tong_so_khach", type: "int", default: 0 })
  th_tong_so_khach!: number;

  @Column({ name: "loai_khach", type: "varchar", nullable: true })
  loai_khach?: string;

  @Column({
    name: "trang_thai",
    type: "enum",
    enum: BookingTrangThai,
    default: BookingTrangThai.BAN_NHAP,
  })
  trang_thai!: BookingTrangThai;

  @Column({
    name: "nguon_dat_cho",
    type: "enum",
    enum: BookingNguonDatCho,
    default: BookingNguonDatCho.NHAN_VIEN_BAN_VE,
  })
  nguon_dat_cho!: BookingNguonDatCho;

  @Column({
    name: "nguon_tinh_gia",
    type: "enum",
    enum: BookingNguonTinhGia,
    nullable: true,
  })
  nguon_tinh_gia?: BookingNguonTinhGia;

  @Column({ name: "meta_data", type: "jsonb", nullable: true })
  meta_data?: Record<string, unknown>;

  @Column({
    name: "th_tong_tien",
    type: "decimal",
    precision: 15,
    scale: 2,
    nullable: true,
  })
  th_tong_tien?: number;

  @Column({ name: "ghi_chu", type: "text", nullable: true })
  ghi_chu?: string;

  @Column({ name: "nguoi_tao", type: "varchar", length: 100, nullable: true })
  nguoi_tao?: string;

  @Column({ name: "nhan_vien_xu_ly", type: "uuid", nullable: true })
  nhan_vien_xu_ly?: string;

  @Column({ name: "thoi_gian_xu_ly", type: "timestamptz", nullable: true })
  thoi_gian_xu_ly?: Date;

  @Column({ name: "tt_xuat_hoa_don", type: "varchar", nullable: true })
  tt_xuat_hoa_don?: string;

  @Column({
    name: "tt_ten_thuyen_truong",
    type: "varchar",
    length: 200,
    nullable: true,
  })
  tt_ten_thuyen_truong?: string;

  @Column({
    name: "tt_so_giay_phep_lai_tau",
    type: "varchar",
    length: 50,
    nullable: true,
  })
  tt_so_giay_phep_lai_tau?: string;

  @Column({
    name: "tt_so_dien_thoai_thuyen_truong",
    type: "varchar",
    length: 20,
    nullable: true,
  })
  tt_so_dien_thoai_thuyen_truong?: string;

  @Column({ name: "tt_so_luong_thuyen_vien", type: "int", nullable: true })
  tt_so_luong_thuyen_vien?: number;

  @Column({
    name: "tt_so_luong_nhan_vien_phuc_vu",
    type: "int",
    nullable: true,
  })
  tt_so_luong_nhan_vien_phuc_vu?: number;

  @CreateDateColumn({ name: "ngay_tao", type: "timestamptz" })
  ngay_tao!: Date;

  @UpdateDateColumn({ name: "ngay_cap_nhat", type: "timestamptz" })
  ngay_cap_nhat!: Date;
}
