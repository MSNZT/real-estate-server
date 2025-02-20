import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*", // Разрешение CORS для разработки
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("joinChat")
  handleJoinChat(client: Socket, chatId: string) {
    client.join(chatId); // Клиент присоединяется к комнате с id chatId
    console.log(`Client ${client.id} joined chat ${chatId}`);
  }

  @SubscribeMessage("sendMessage")
  handleEvent(client: Socket, payload: { chatId: string; message: string }) {
    console.log(`Message received: ${JSON.stringify(payload.message)}`);
    // Отправляем сообщение только в конкретную комнату
    this.server.to(payload.chatId).emit("receiveMessage", payload.message);
  }
}
