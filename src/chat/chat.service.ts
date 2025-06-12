import { PrismaService } from "@/prisma/prisma.service";
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { MessageDto } from "./dto/message.dto";

export interface Message {
  senderId: string;
  content: string;
  timestamp: Date;
}

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}
  logger = new Logger(ChatService.name);

  async getChatList(userId: string) {
    try {
      const chats = await this.prismaService.chat.findMany({
        where: {
          OR: [{ userId1: userId }, { userId2: userId }],
        },
        include: {
          user1: true,
          user2: true,
          messages: {
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (chats.length) {
        return chats.map((chat) => {
          const isFirstUser = userId === chat.userId1;
          const companion = isFirstUser ? chat.user2 : chat.user1;
          const lastMessage = chat.messages[0] || null;

          return {
            chatId: chat.id,
            companion: {
              id: companion.id,
              name: companion.name,
            },
            lastMessage: lastMessage
              ? {
                  text: lastMessage.text,
                  createdAt: lastMessage.createdAt,
                  userId: lastMessage.authorId,
                }
              : null,
          };
        });
      }
      return [];
    } catch (error) {
      this.logger.error("Ошибка при получении списка чатов", error);
      throw error;
    }
  }

  async getChatById(chatId: string, userId: string) {
    try {
      console.log(chatId);

      const existChat = await this.prismaService.chat.findUnique({
        where: {
          id: chatId,
          OR: [{ userId1: userId }, { userId2: userId }],
        },
      });
      if (!existChat) {
        return { status: "error" };
      }
      return {
        status: "success",
      };
    } catch (error) {
      this.logger.error("getChatById", error);
      throw error;
    }
  }

  async joinToChat(userId: string, userId2: string): Promise<string> {
    console.log("Test join chat", userId, userId2)
    try {
      if (userId.userId === userId2) {
        throw new BadRequestException("Нельзя создать чат с самим собой");
      }
      let chat = await this.prismaService.chat.findUnique({
        where: {
          userId1_userId2: { userId1: userId.userId, userId2 },
        },
      });
      if (!chat) {
        chat = await this.prismaService.chat.create({
          data: {
            userId1: userId,
            userId2,
          },
        });
      }
      return chat.id;
    } catch (error) {
      this.logger.error("joinToChat", error);
      throw error;
    }
  }

  async sendMessage(dto: MessageDto) {
    try {
      const message = await this.prismaService.message.create({
        data: {
          chatId: dto.channelId,
          text: dto.text,
          createdAt: dto.date,
          authorId: dto.authorId,
        },
      });
      return message;
    } catch (error) {
      this.logger.error("Ошибка при создании сообщения", error);
      throw error;
    }
  }

  async getMessages(chatId: string, userId: string) {
    try {
      const response = await this.prismaService.chat.findUnique({
        where: {
          id: chatId,
          OR: [{ userId1: userId }, { userId2: userId }],
        },
        include: {
          messages: {
            take: 40,
          },
          user1: true,
          user2: true,
        },
      });
      if (!response) {
        throw new NotFoundException("Чат не найден");
      }
      const isFirstUser = response.userId1 === userId;
      const companion = {
        name: isFirstUser ? response.user2.name : response.user1.name,
        id: isFirstUser ? response.user2.id : response.user1.id,
      };

      return {
        companion,
        messages: response.messages,
      };
    } catch (error) {
      this.logger.error("Ошибка при получении сообщений в чате", error);
      throw error;
    }
  }

  async getUserContacts(userId: string): Promise<string[]> {
    try {
      const chatIds = await this.prismaService.chat.findMany({
        where: {
          OR: [{ userId1: userId }, { userId2: userId }],
        },
        include: {
          user1: true,
          user2: true,
        },
      });

      return chatIds.map((chat) => {
        const isFirstUser = chat.userId1 === userId;
        const companion = isFirstUser ? chat.userId2 : chat.userId1;
        return companion;
      });
    } catch (error) {}
  }
}
