import { RegisterDto } from "@/auth/dto";
import { Injectable } from "@nestjs/common";
import { hash } from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findByIdOrEmail(emailOrId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ id: emailOrId }, { email: emailOrId }],
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async create(dto: RegisterDto) {
    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password, 6),
        name: dto.name,
        avatar: dto.avatar,
      },
    });
    return user;
  }
}
