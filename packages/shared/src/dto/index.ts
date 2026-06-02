import { IsNotEmpty, IsString } from "class-validator";

export class PaginationQueryDto {
  @IsString({ message: "Trang phải là chuỗi số" })
  page?: string;

  @IsString({ message: "Kích thước trang phải là chuỗi số" })
  pageSize?: string;
}

export class CreateExampleDto {
  @IsString({ message: "Tên không được để trống" })
  @IsNotEmpty({ message: "Tên không được để trống" })
  name!: string;
}

export * from "./bookings";
