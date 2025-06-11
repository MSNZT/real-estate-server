import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { PrismaService } from "@/prisma/prisma.service";

@Module({
  providers: [ChatGateway, ChatService, PrismaService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
