import { NestFactory } from "@nestjs/core";
import { join } from "path";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as passport from "passport";
import { AppModule } from "./app/app.module";

import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { StrictValidationPipe } from "./app/pipes/strict-validation.pipe";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const clientUrl = configService.getOrThrow("CLIENT_URL");
  const PORT = configService.get("PORT") || 3000;
  const logger = app.get(WINSTON_MODULE_PROVIDER);

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

  app.useGlobalPipes(new StrictValidationPipe(logger));

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

  await app.listen(PORT, "0.0.0.0");
  console.log("Application is running on port: ", PORT);
}

bootstrap();
