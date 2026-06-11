import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("tau_thuyen", { synchronize: false })
export class TauThuyen {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "ten_tau", type: "varchar", length: 200 })
  ten_tau!: string;

  @Column({ name: "ma_tau", type: "varchar", length: 50 })
  ma_tau!: string;

  @Column({ name: "suc_chua_toi_da", type: "int", nullable: true })
  suc_chua_toi_da?: number;

  @Column({ name: "email", type: "varchar", length: 255, nullable: true })
  email?: string;

  @CreateDateColumn({ name: "ngay_tao", type: "timestamptz" })
  ngay_tao!: Date;

  @UpdateDateColumn({ name: "ngay_cap_nhat", type: "timestamptz" })
  ngay_cap_nhat!: Date;
}
