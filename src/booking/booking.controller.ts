import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { CurrentUser } from "@/user/decorators/current-user";
import { BookingService } from "./booking.service";
import { BookingCreateDto } from "./dto/booking-create.dto";
import { HttpExceptionFilter } from "@/errors/http-exception.filter";
import { BookingCalculatePrice } from "./dto/calculatePrice.dto";
import { AuthJwt } from "@/auth/decorators/auth-jwt.decorator";

@UseFilters(HttpExceptionFilter)
@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @AuthJwt()
  @Post("create")
  async createBooking(
    @Body() dto: BookingCreateDto,
    @CurrentUser() user: Pick<User, "id">,
  ) {
    return await this.bookingService.createBooking(dto, user.id);
  }

  @Get("occupied-dates/:id")
  async getOccupiedDates(@Param("id") id: string) {
    console.log("occupied");
    return await this.bookingService.getOccupiedDates(id);
  }

  @AuthJwt()
  @Get("my")
  async getMyOrders(@CurrentUser() user: Pick<User, "id">) {
    return await this.bookingService.getMyOrders(user.id as string);
  }

  @Post("calculate")
  async calculatePrice(@Body() dto: BookingCalculatePrice) {
    return await this.bookingService.calculatePrice(dto);
  }

  @AuthJwt()
  @Delete("cancel/:id")
  async cancel(@Param("id") id: string, @CurrentUser() user: Pick<User, "id">) {
    return await this.bookingService.cancelBooking(id, user.id);
  }
}
