import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { BookingCreateDto } from "./dto/booking-create.dto";
import { BookingCalculatePrice } from "./dto/calculatePrice.dto";
import { getOrderTitle } from "./utils/getOrderTitle";

@Injectable()
export class BookingService {
  logger = new Logger(BookingService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async createBooking(dto: BookingCreateDto, userId: string) {
    try {
      const { adId, endDate, startDate, guestName, guestPhone, guestCounts } =
        dto;

      const adExists = await this.prismaService.ad.findUnique({
        where: { id: adId },
      });

      if (!adExists) {
        throw new NotFoundException("Объявление не найдено");
      }

      if (adExists.adType === "sell") {
        throw new BadRequestException(
          "Объявление с типом sell не может использоваться для бронирования",
        );
      }
      if (startDate >= endDate) {
        console.log(
          startDate,
          endDate,
          startDate >= endDate,
          typeof startDate,
          typeof endDate,
        );
        throw new BadRequestException(
          "Дата начала бронирования не может быть больше или равна окончанию",
        );
      }

      const booking = await this.prismaService.booking.findMany({
        where: {
          adId,
          renterId: userId,
          OR: [
            {
              startDate: {
                lt: dto.endDate,
              },
              endDate: {
                gt: dto.startDate,
              },
            },
          ],
        },
      });

      if (booking.length > 0) {
        throw new BadRequestException("На текущую дату бронирования мест нет");
      }

      return await this.prismaService.booking.create({
        data: {
          startDate,
          endDate,
          guestCounts,
          guestName,
          guestPhone,
          renter: {
            connect: { id: userId },
          },
          ad: {
            connect: { id: adId },
          },
        },
      });
    } catch (error) {
      this.logger.error("Ошибка при создании бронирования", error);
      throw error;
    }
  }

  async getBookingDetails(id: string) {
    try {
      const today = new Date();
      const firstDayOfCurrentMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
      const bookingList = await this.prismaService.booking.findMany({
        where: {
          adId: id,
          startDate: {
            gte: firstDayOfCurrentMonth,
          },
        },
      });

      if (!bookingList.length) return [];
      return bookingList;
    } catch (error) {
      this.logger.error("Ошибка при получении бронирования по id", error);
      throw error;
    }
  }

  async getMyOrders(userId: string) {
    try {
      const orders = await this.prismaService.booking.findMany({
        where: {
          renterId: userId,
        },
        select: {
          adId: true,
          startDate: true,
          endDate: true,
          ad: {
            select: {
              title: true,
              mainPhoto: true,
              location: {
                select: {
                  city: true,
                },
              },
            },
          },
        },
      });

      if (orders.length > 0)
        return orders.map((order) => [
          {
            orderTitle: getOrderTitle(
              order.ad.location.city,
              order.startDate,
              order.endDate,
            ),
            adTitle: order.ad.title,
            photo: order.ad.mainPhoto,
          },
        ]);
      return [];
    } catch (error) {
      this.logger.error("Ошибка при списка бронирований", error);
      return [];
    }
  }

  async cancelBooking(adId: string, userId: string) {
    try {
      const existBooking = await this.prismaService.booking.findFirst({
        where: { adId },
      });

      if (!existBooking) {
        throw new NotFoundException("Бронирование не найдено");
      }

      if (existBooking.renterId !== userId) {
        throw new ForbiddenException("Нет доступа для удаления бронирования");
      }

      return await this.prismaService.booking.delete({
        where: {
          id: existBooking.id,
        },
      });
    } catch (error) {
      this.logger.error("Ошибка при отмене бронирования", error);
      throw error;
    }
  }

  async calculatePrice(dto: BookingCalculatePrice) {
    const { countDays, price } = dto;

    const totalPrice = countDays * price;
    const prepayment = Math.round((totalPrice / 100) * 20);
    const remainder = totalPrice - prepayment;

    return {
      totalPrice,
      prepayment,
      remainder,
    };
  }
}
