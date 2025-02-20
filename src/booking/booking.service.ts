import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { BookingCreateDto } from "./dto/booking-create.dto";

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBooking(dto: BookingCreateDto, userId: string) {
    try {
      const { adId, endDate, startDate } = dto;

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
          renter: {
            connect: { id: userId },
          },
          ad: {
            connect: { id: adId },
          },
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async cancelBooking(adId: string, userId: string) {
    try {
      const existBooking = await this.prismaService.booking.findFirst({
        where: { adId },
      });

      if (existBooking.renterId !== userId) {
        throw new ForbiddenException("Нет доступа для удаления бронирования");
      }

      return await this.prismaService.booking.delete({
        where: {
          id: existBooking.id,
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
