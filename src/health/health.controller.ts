import { Controller, Get, Logger } from "@nestjs/common";

@Controller("health")
export class HealthController {
  logger = new Logger(HealthController.name);

  @Get()
  checkHealth() {
    this.logger.log("Health check ping", new Date().toISOString());
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
