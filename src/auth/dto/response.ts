import { Exclude, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { User, UserRoles } from "@prisma/client";

export class UserDto {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  roles: UserRoles;
  phone: string;

  @Exclude()
  provider: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  password: string | null;

  @Exclude()
  resetPasswordCode: string;

  @Exclude()
  resetPasswordExpires: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

export class AccountsDto {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  roles: UserRoles;
  phone: string;

  constructor(data: User & { phone: string }) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.avatar = data.avatar || null;
    this.roles = data.roles;
    this.phone = data.phone;
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
