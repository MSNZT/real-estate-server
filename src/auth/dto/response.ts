import { Exclude, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { UserRoles } from "@prisma/client";

export class UserDto {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  roles: UserRoles;

  @Exclude()
  provider: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  password: string | null;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

export class ResponseDto {
  accessToken: string;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  constructor(partial: Partial<ResponseDto>) {
    Object.assign(this, partial);
  }
}
