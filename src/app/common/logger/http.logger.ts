import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { WinstonConfig } from "./winston.config";

@Injectable()
export class HttpLogger implements NestMiddleware {
  private logger;
  constructor(private readonly winstonConfig: WinstonConfig) {
    this.logger = this.winstonConfig.createLogger();
  }

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers["user-agent"] || "";

    res.on("finish", () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      this.logger.http({
        context: "HTTP",
        message: `${method} ${originalUrl}`,
        status: statusCode,
        duration: `${duration}ms`,
        ip,
        userAgent,
        bodySize: res.get("content-length") || "0",
        params: Object.keys(req.params).length ? req.params : undefined,
        query: Object.keys(req.query).length ? req.query : undefined,
      });
    });

    next();
  }
}
