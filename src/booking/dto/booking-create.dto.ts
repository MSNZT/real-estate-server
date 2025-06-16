import { IsISO8601, IsNumber, IsString } from "class-validator";

export class BookingCreateDto {
  @IsString({ message: "Необходимо указать id объявления" })
  adId: string;

  @IsISO8601(
    { strict: true },
    { message: "Необходимо указать startDate в формате ISO" },
  )
  startDate: string;

  @IsISO8601(
    { strict: true },
    { message: "Необходимо указать endDate в формате ISO" },
  )
  endDate: string;

  @IsString()
  guestPhone: string;

  @IsString()
  guestName: string;

  @IsNumber()
  guestCounts: number;
}
