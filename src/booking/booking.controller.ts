import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth-guard";
import { CurrentUser } from "@/user/decorators/current-user";
import { BookingService } from "./booking.service";
import { BookingCreateDto } from "./dto/booking-create.dto";
import { HttpExceptionFilter } from "@/errors/http-exception.filter";
import { BookingCalculatePrice } from "./dto/calculatePrice.dto";
import { AuthJwt } from "@/ath/decorators/auth-jwt.decorator";

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

  @AuthJwt()
  @Get("details/:id")
  async getBookingDetails(@Param("id") id: string) {
    return await this.bookingService.getBookingDetails(id);
  }

  @AuthJwt()
  @Get()
  async getMyOrders(@CurrentUser() user: any) {
    return await this.bookingService.getMyOrders(user.id as string);
  }

  @Post("calculate")
  async calculatePrice(@Body() dto: BookingCalculatePrice) {
    console.log(dto);

    return await this.bookingService.calculatePrice(dto);
  }

  @AuthJwt()
  @Delete("cancel/:id")
  async cancel(@Param("id") id: string, @CurrentUser() user: any) {
    return await this.bookingService.cancelBooking(id, user);
  }
}
