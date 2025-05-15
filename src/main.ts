import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as passport from "passport";
import { join } from "path";

import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger("Bootstrap");

  app.use((err, req, res, next) => {
    if (
      err instanceof SyntaxError &&
      "status" in err &&
      err.status === 400 &&
      "body" in err
    ) {
      logger.error("Invalid JSON format in request body", err);
      return res.status(400).json({
        message: "Invalid JSON format",
        error: err.message,
      });
    }
    next();
  });

  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/files",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        logger.error("Validation errors", errors);
        const formattedErrors = errors.reduce((acc, err) => {
          if (err.constraints) {
            acc[err.property] = Object.values(err.constraints);
          } else {
            logger.warn(`No constraints for property: ${err.property}`);
            acc[err.property] = ["Неизвестная ошибка валидации"];
          }
          return acc;
        }, {});
        logger.error("Formatted errors", formattedErrors);
        return new BadRequestException(formattedErrors);
      },
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: "set-cookie",
  });

  app.use(
    session({
      secret: "secret235345",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix("api");

  await app.listen(5001);
  logger.log("Application is running on port 7000");
}

bootstrap();
