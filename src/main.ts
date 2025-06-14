import { NestFactory } from "@nestjs/core";
import { join } from "path";
import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as passport from "passport";
import { AppModule } from "./app/app.module";

import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger("Bootstrap");
  const configService = app.get(ConfigService);
  const clientUrl = configService.getOrThrow("CLIENT_URL");
  const PORT = configService.get("PORT") || 3000;

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
  app.useStaticAssets(join(process.cwd(), "assets"), {
    prefix: "/assets",
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
    origin: clientUrl,
    credentials: true,
    exposedHeaders: ["set-cookie"],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "OPTIONS"],
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
  // app.

  await app.listen(PORT, "0.0.0.0");
  logger.log("Application is running on port: ", PORT);
}

bootstrap();
