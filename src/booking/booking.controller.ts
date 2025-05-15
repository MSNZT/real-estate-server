import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { Prisma, User } from "@prisma/client";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth-guard";
import { CurrentUser } from "@/users/decorators/current-user";
import { BookingService } from "./booking.service";
import { BookingCreateDto } from "./dto/booking-create.dto";
import { HttpExceptionFilter } from "@/errors/http-exception.filter";
import { BookingCalculatePrice } from "./dto/calculatePrice.dto";

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
    return await this.bookingService.createBooking(dto, user.id);
  }

  @Get("details/:id")
  async getBookingListById(@Param("id") id: string) {
    return await this.bookingService.getBookingListById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("orders")
  async getMyOrders(@CurrentUser() user: any) {
    return await this.bookingService.getMyOrders(user.id as string);
  }

  @Post("calculate")
  async calculatePrice(@Body() dto: BookingCalculatePrice) {
    console.log(dto);

    return await this.bookingService.calculatePrice(dto);
  }

  @Delete("cancel/:id")
  async cancel(@Param("id") id: string, @CurrentUser() user: any) {
    return await this.bookingService.cancelBooking(id, user);
  }
}
