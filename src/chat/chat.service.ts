import { Injectable } from "@nestjs/common";

export interface Message {
  senderId: string;
  content: string;
  timestamp: Date;
}

@Injectable()
export class ChatService {
  // Хранилище чатов (пока в памяти)
  private chats: { [chatId: string]: Message[] } = {};

  // Получение всех чатов (только для демонстрации)
  getAllChats() {
    return Object.keys(this.chats);
  }

  // Получение сообщений для определенного чата
  getMessages(chatId: string): Message[] {
    return this.chats[chatId] || [];
  }

  // Добавление сообщения в чат
  addMessage(
    chatId: string,
    messageDto: { senderId: string; content: string },
  ) {
    const message: Message = {
      senderId: messageDto.senderId,
      content: messageDto.content,
      timestamp: new Date(),
    };

    // Если чата еще нет, создаем его
    if (!this.chats[chatId]) {
      this.chats[chatId] = [];
    }

    // Добавляем сообщение в чат
    this.chats[chatId].push(message);

    // Возвращаем обновленный список сообщений
    return this.getMessages(chatId);
  }
}
