import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { ChatModule } from "@/chat/chat.module";
import { UserModule } from "@/user/user.module";
import { AdModule } from "@/ad/ad.module";
import { BookingModule } from "@/booking/booking.module";
import { FileModule } from "@/file/file.module";
import { graphqlConfig } from "./config/graphql.config";
import { AuthModule } from "@/ath/auth.module";
import { ScheduleModule } from "@nestjs/schedule";
import { FavoriteModule } from "@/favorite/favorite.module";
import { HealthModule } from "@/health/health.module";
import { HttpLogger } from "./common/logger/http.logger";
import { WinstonConfig } from "./common/logger/winston.config";
import { LoggerModule } from "./common/logger/logger.module";
import { LocationModule } from "@/location/location.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    LoggerModule.forRoot(),
    ChatModule,
    AuthModule,
    UserModule,
    AdModule,
    BookingModule,
    FileModule,
    FavoriteModule,
    HealthModule,
    LocationModule,
  ],
  providers: [WinstonConfig],
})
export class AppModule implements NestModule, OnModuleInit {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLogger).forRoutes("*");
  }
  onModuleInit() {
    setInterval(() => {
      const memoryUsage = process.memoryUsage();
      console.log({
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
      });
    }, 30 * 1000);
  }
}
