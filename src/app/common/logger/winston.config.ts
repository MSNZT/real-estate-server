import * as winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WinstonConfig {
  public readonly levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  };

  public readonly colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    verbose: "cyan",
    debug: "blue",
    silly: "gray",
  };

  constructor() {
    winston.addColors(this.colors);
  }

  public getConsoleFormat() {
    return winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS",
      }),
      winston.format.colorize({ all: true }),
      nestWinstonModuleUtilities.format.nestLike("MyApp", {
        colors: true,
        prettyPrint: true,
      }),
      winston.format.printf((info) => {
        return [
          `${info.timestamp}`,
          `${info.level}:`.padEnd(7),
          `${info.message}`.padEnd(30),
          `${info.status}`.padEnd(4),
          `${info.duration}`.padEnd(8),
          `from ${info.ip}`.padEnd(20),
          `${info.userAgent}`,
        ].join(" ");
      }),
    );
  }

  public getFileFormat() {
    return winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS",
      }),
      winston.format.json(),
      winston.format.printf((info: any) => {
        info.timestamp = new Date(info.timestamp).toISOString();
        return JSON.stringify(info);
      }),
    );
  }

  public getTransports() {
    return [
      new winston.transports.Console({
        level: "debug",
        format: this.getConsoleFormat(),
      }),
      new DailyRotateFile({
        level: "info",
        dirname: "logs",
        filename: "application-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        format: this.getFileFormat(),
      }),
      new DailyRotateFile({
        level: "error",
        dirname: "logs/errors",
        filename: "error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "30d",
        format: this.getFileFormat(),
      }),
    ];
  }

  public createLogger() {
    return winston.createLogger({
      level: "info",
      levels: this.levels,
      transports: this.getTransports(),
      exceptionHandlers: [
        new DailyRotateFile({
          dirname: "logs/exceptions",
          filename: "exception-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "30d",
          format: this.getFileFormat(),
        }),
      ],
    });
  }
}
