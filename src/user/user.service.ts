// import { RegisterDto } from "@/auth/dto";
import { RegisterDto } from "@/auth/dto/register.dto";
import { ResetPasswordCodeDto } from "@/auth/dto/reset-password.dto";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { hash } from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async create(dto: RegisterDto) {
    const password = dto.password ? await hash(dto.password, 6) : null;
    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password,
        name: dto.name,
        phone: dto.phone,
      },
    });
    return user;
  }

  async updateUser(email: string, updatedData: Partial<User>) {
    const password = updatedData.password
      ? await hash(updatedData.password, 6)
      : null;
    return this.prismaService.user.update({
      where: { email },
      data: {
        ...updatedData,
        password,
      },
    });
  }
}
