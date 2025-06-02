import { User, UserRoles } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class UserResponseDto implements Partial<User> {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Exclude()
  password: string;

  @Exclude()
  roles: UserRoles;

  @Exclude()
  resetPasswordCode: string | null;

  @Exclude()
  resetPasswordExpires: Date | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
