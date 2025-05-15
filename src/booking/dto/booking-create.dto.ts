import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class BookingCreateDto {
  @IsNotEmpty({ message: "Необходимо указать id объявления" })
  adId: string;

  @IsNotEmpty({ message: "Необходимо указать дату начала аренды" })
  // @IsDateDMY()
  @IsString()
  startDate: string;

  @IsNotEmpty({
    message: `В поле "endDate" необходимо указать дату окончания аренды`,
  })
  // @IsDateDMY()
  @IsString()
  endDate: string;

  @IsString()
  guestPhone: string;

  @IsString()
  guestName: string;

  @IsNumber()
  guestCounts: number;
}
