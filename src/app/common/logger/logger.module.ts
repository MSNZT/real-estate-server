import { Module, Global } from "@nestjs/common";
import { WinstonConfig } from "./winston.config";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";

@Global()
@Module({
  providers: [WinstonConfig],
  exports: [WinstonConfig],
})
export class LoggerModule {
  static forRoot() {
    return WinstonModule.forRootAsync({
      imports: [LoggerModule],
      useFactory: (winstonConfig: WinstonConfig) => {
        return {
          levels: winstonConfig.levels,
          transports: winstonConfig.getTransports(),
          exceptionHandlers: [
            new winston.transports.DailyRotateFile({
              dirname: "logs/exceptions",
              filename: "exception-%DATE%.log",
              datePattern: "YYYY-MM-DD",
              zippedArchive: true,
              maxSize: "20m",
              maxFiles: "30d",
              format: winstonConfig.getFileFormat(),
            }),
          ],
        };
      },
      inject: [WinstonConfig],
    });
  }
}
