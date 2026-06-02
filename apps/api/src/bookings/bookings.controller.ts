import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { BookingsService } from "./bookings.service";
import {
  CreateBookingsDto,
  UpdateBookingsDto,
  BookingListQueryDto,
  ThongKeQueryDto,
} from "@workspace/shared";

@ApiTags("Bookings")
@ApiBearerAuth()
@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get("phan-trang")
  @ApiOperation({
    summary: "Lấy danh sách booking phân trang",
    description:
      "Trả về danh sách booking có phân trang và hỗ trợ filter theo trạng thái, tàu, ngày đi, hành trình, keyword",
  })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Số trang (mặc định: 1)" })
  @ApiQuery({ name: "pageSize", required: false, type: Number, description: "Kích thước trang (mặc định: 20)" })
  @ApiQuery({ name: "trang_thai", required: false, description: "Trạng thái booking" })
  @ApiQuery({ name: "tau_thuyen_id", required: false, description: "ID tàu thuyền" })
  @ApiQuery({ name: "tu_ngay", required: false, description: "Ngày đi từ (ISO 8601)" })
  @ApiQuery({ name: "den_ngay", required: false, description: "Ngày đi đến (ISO 8601)" })
  @ApiQuery({ name: "keyword", required: false, description: "Tìm theo mã đặt chỗ, người tạo" })
  @ApiResponse({
    status: 200,
    description: "Danh sách booking phân trang",
    schema: {
      example: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 20,
      },
    },
  })
  async findPaginated(@Query() query: BookingListQueryDto) {
    return this.bookingsService.findPaginated(query);
  }

  @Get("thong-ke")
  @ApiOperation({
    summary: "Thống kê booking theo trạng thái",
    description: "Trả về số lượng và tổng tiền booking theo từng trạng thái",
  })
  @ApiQuery({ name: "tu_ngay", required: false, description: "Ngày bắt đầu (ISO 8601)" })
  @ApiQuery({ name: "den_ngay", required: false, description: "Ngày kết thúc (ISO 8601)" })
  @ApiQuery({ name: "tau_thuyen_id", required: false, description: "ID tàu thuyền" })
  @ApiResponse({
    status: 200,
    description: "Danh sách thống kê theo trạng thái",
    schema: {
      example: [
        { trang_thai: "ban_nhap", so_luong: 5, tong_tien: 1500000 },
        { trang_thai: "da_duyet", so_luong: 10, tong_tien: 5000000 },
      ],
    },
  })
  async getThongKe(@Query() query: ThongKeQueryDto) {
    return this.bookingsService.getThongKe(query);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Lấy chi tiết booking",
    description: "Trả về thông tin chi tiết của một booking bao gồm tàu thuyền, chủ tàu, nhân viên xử lý",
  })
  @ApiParam({ name: "id", description: "ID của booking (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Thông tin chi tiết booking",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy booking",
  })
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    return this.bookingsService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: "Tạo booking mới",
    description: "Tạo một booking mới với trạng thái ban đầu là bản nháp",
  })
  @ApiResponse({
    status: 201,
    description: "Booking đã được tạo thành công",
  })
  @ApiResponse({
    status: 400,
    description: "Dữ liệu đầu vào không hợp lệ",
  })
  async create(@Body() dto: CreateBookingsDto) {
    return this.bookingsService.create(dto);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Cập nhật booking",
    description: "Cập nhật thông tin của một booking theo ID",
  })
  @ApiParam({ name: "id", description: "ID của booking (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Booking đã được cập nhật thành công",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy booking",
  })
  @ApiResponse({
    status: 400,
    description: "Dữ liệu đầu vào không hợp lệ",
  })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingsDto
  ) {
    return this.bookingsService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Xoá booking",
    description: "Xoá mềm một booking (chuyển trạng thái sang da_xoa)",
  })
  @ApiParam({ name: "id", description: "ID của booking (UUID)" })
  @ApiResponse({
    status: 204,
    description: "Booking đã được xoá thành công",
  })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy booking",
  })
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    await this.bookingsService.softDelete(id);
  }
}
