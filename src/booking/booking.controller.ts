import { Body, Controller, Post, UseFilters, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth-guard";
import { CurrentUser } from "@/users/decorators/current-user";
import { BookingService } from "./booking.service";
import { BookingCreateDto } from "./dto/booking-create.dto";
import { HttpExceptionFilter } from "@/errors/http-exception.filter";

@UseFilters(HttpExceptionFilter)
@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create")
  async createBooking(
    @Body() dto: BookingCreateDto,
    @CurrentUser() user: Pick<User, "id">,
  ) {
    const [day, month, year] = dto.startDate.split("/");
    const startDate = new Date(`${year}-${month}-${day}`).toISOString();

    const [endDay, endMonth, endYear] = dto.endDate.split("/");
    const endDate = new Date(`${endYear}-${endMonth}-${endDay}`).toISOString();

    const createDto: BookingCreateDto = {
      adId: dto.adId,
      startDate,
      endDate,
    };
    return await this.bookingService.createBooking(createDto, user.id);
  }
}
