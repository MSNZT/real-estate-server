import { IsString } from "class-validator";

export class MessageDto {
  @IsString()
  text: string;

  @IsString()
  authorId: string;

  @IsString()
  date: string;

  @IsString()
  channelId: string;
}

export class UserDto {
  @IsString()
  userId: string;
}
