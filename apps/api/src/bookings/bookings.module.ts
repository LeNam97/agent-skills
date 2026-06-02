import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";
import { Bookings, BookingsRepository } from "@ac/api-models";

@Module({
  imports: [TypeOrmModule.forFeature([Bookings])],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsRepository],
  exports: [BookingsService, BookingsRepository],
})
export class BookingsModule {}
