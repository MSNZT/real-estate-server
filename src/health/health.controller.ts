import { Controller, Get, Logger, Query } from "@nestjs/common";

@Controller("health")
export class HealthController {
  logger = new Logger(HealthController.name);

  @Get()
  checkHealth(@Query("test") test: string) {
    console.log(test);
    this.logger.error("Health check ping", new Date().toISOString());
    this.logger.log("Вызов checkHealth");

    return { status: "false", timestamp: new Date().toISOString() };
  }
}
