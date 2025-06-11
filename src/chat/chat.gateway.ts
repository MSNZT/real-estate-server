import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { MessageDto } from "./dto/message.dto";

@WebSocketGateway({
  namespace: "/chat",
  cors: { origin: "*" },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private usersOnline = new Map<string, Set<string>>();

  constructor(private chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const channelId = client.handshake.query.channelId as string;
    const userId = client.handshake.query.userId as string;
    if (!userId) return;

    let sockets = this.usersOnline.get(userId);
    if (!sockets) sockets = new Set();
    sockets.add(client.id);
    this.usersOnline.set(userId, sockets);

    client.join(channelId);
    console.log(`Socket ${client.id} joined channel ${channelId}`);

    const contacts = await this.chatService.getUserContacts(userId);
    console.log(contacts, "contacts");

    for (const contactId of contacts) {
      const contactSockets = this.usersOnline.get(contactId);
      if (contactSockets) {
        for (const sid of contactSockets) {
          console.log(sid, "sid");
          this.server.to(sid).emit("userOnline", { userId });
        }
      }
    }

    console.log("Users Online", this.usersOnline);
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) return;

    const sockets = this.usersOnline.get(userId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.usersOnline.delete(userId);
        const contacts = await this.chatService.getUserContacts(userId);
        for (const contactId of contacts) {
          const contactSockets = this.usersOnline.get(contactId);
          if (contactSockets) {
            for (const sid of contactSockets) {
              this.server.to(sid).emit("userOffline", { userId });
            }
          }
        }
      }
    }
  }

  @SubscribeMessage("join")
  async handleJoin(
    @MessageBody() data: { channelId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.channelId);
    console.log("join", data.channelId);
  }

  @SubscribeMessage("leave")
  async handleLeave(
    @MessageBody() data: { channelId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.channelId);
  }

  @SubscribeMessage("sendMessage")
  async handleMessage(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const channelId = message.channelId;
    console.log("Channel", channelId);
    const response = await this.chatService.sendMessage(message);
    console.log(response);

    this.server.to(channelId).emit("newMessage", response);
  }

  @SubscribeMessage("getOnlineStatus")
  async handleGetOnlineStatus(
    @MessageBody() data: { companionIds: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    const onlineMap: Record<string, boolean> = {};
    for (const id of data.companionIds) {
      onlineMap[id] = this.usersOnline.has(id);
    }
    console.log("GET_ONLINE_STATUS", data, onlineMap);
    client.emit("getOnlineStatusResult", onlineMap);
  }
}
