import { User } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

export class UserDto {
  @IsString()
  userId: string;
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  phone: string;

  constructor(userData: User) {
    this.userId = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.phone = userData.phone;
  }
}
