import { join } from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import { AuthModule } from "@/auth/auth.module";
import { ChatModule } from "@/chat/chat.module";
import { UsersModule } from "@/users/users.module";
import { AdModule } from "@/ad/ad.module";
import { BookingModule } from "@/booking/booking.module";

import { formatError } from "./errors/formatGraphqlError";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      path: "/api/ads",
      context: ({ req }) => ({ req }),
      formatError: formatError,
      debug: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
    AuthModule,
    UsersModule,
    AdModule,
    BookingModule,
  ],
  providers: [
    // ChatGateway,
  ],
})
export class AppModule {}
