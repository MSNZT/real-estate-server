import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriverConfig } from "@nestjs/apollo";
// import { AuthModule } from "@/auth/auth.module";
import { ChatModule } from "@/chat/chat.module";
import { UserModule } from "@/user/user.module";
import { AdModule } from "@/ad/ad.module";
import { BookingModule } from "@/booking/booking.module";
import { FileModule } from "@/file/file.module";
import { graphqlConfig } from "./config/graphql.config";
import { AuthModule } from "@/ath/auth.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ChatModule,
    AuthModule,
    UserModule,
    AdModule,
    BookingModule,
    FileModule,
  ],
  providers: [
    // ChatGateway,
  ],
})
export class AppModule {}
