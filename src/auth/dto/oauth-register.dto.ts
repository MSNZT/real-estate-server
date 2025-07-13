import { IsPhoneNumber } from "../validators/IsPhoneNumber";

export class OAuthRegisterDto {
  @IsPhoneNumber()
  phone: string;
}
