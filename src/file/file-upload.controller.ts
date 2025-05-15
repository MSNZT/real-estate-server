import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth-guard";

@Controller("files")
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post("uploads")
  @UseInterceptors(FilesInterceptor("files"))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return this.fileUploadService.uploadFile(files);
  }
}
