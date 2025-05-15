import { Module } from "@nestjs/common";
import { FileUploadController } from "./file-upload.controller";
import { FileUploadService } from "./file-upload.service";
import { MulterModule } from "@nestjs/platform-express";
import { multerConfig } from "./config/multer.config";

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
