import { IsNotEmpty } from "class-validator";
import { IsDateDMY } from "../decorator/IsDateDMY";

export class BookingCreateDto {
  @IsNotEmpty({ message: "Необходимо указать id объявления" })
  adId: string;

  @IsNotEmpty({ message: "Необходимо указать дату начала аренды" })
  @IsDateDMY()
  startDate: string;

  @IsNotEmpty({
    message: `В поле "endDate" необходимо указать дату окончания аренды`,
  })
  @IsDateDMY()
  endDate: string;
}
