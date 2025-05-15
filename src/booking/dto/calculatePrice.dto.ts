import { IsNumber } from "class-validator";

export class BookingCalculatePrice {
  @IsNumber({ allowNaN: false }, { message: "Укажите количество дней" })
  countDays: number;

  @IsNumber({ allowNaN: false }, { message: "Укажите стоимость за сутки" })
  price: number;
}
