import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { AuthJwt } from "@/ath/decorators/auth-jwt.decorator";
import { CurrentUser } from "@/user/decorators/current-user";
import { User } from "@prisma/client";
import { UserDto } from "./dto/message.dto";

@AuthJwt()
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("list")
  async getChatList(@CurrentUser() user: Pick<User, "id">) {
    return this.chatService.getChatList(user.id);
  }

  @Get(":id")
  async getChatById(
    @Param("id") chatId: string,
    @CurrentUser() user: Pick<User, "id">,
  ) {
    return this.chatService.getChatById(chatId, user.id);
  }

  @Post("join")
  async joinToChat(
    @CurrentUser() user: Pick<User, "id">,
    @Body() dto: UserDto,
  ) {
    console.log("auuu");
    return this.chatService.joinToChat(dto, user.id);
  }

  @Get(":chatId/messages")
  async getMessages(
    @Param("chatId") chatId: string,
    @CurrentUser() user: Pick<User, "id">,
  ) {
    return this.chatService.getMessages(chatId, user.id);
  }
}
