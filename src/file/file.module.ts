import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { multerConfig } from "./config/multer.config";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
