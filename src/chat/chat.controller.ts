import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Получение всех чатов
  @Get()
  getAllChats() {
    return this.chatService.getAllChats();
  }

  // Получение сообщений для определенного чата по chatId
  @Get(":chatId/messages")
  getMessages(@Param("chatId") chatId: string) {
    return this.chatService.getMessages(chatId);
  }

  // Создание нового сообщения в чате
  @Post(":chatId/messages")
  sendMessage(
    @Param("chatId") chatId: string,
    @Body() messageDto: { senderId: string; content: string },
  ) {
    return this.chatService.addMessage(chatId, messageDto);
  }
}
