import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileService } from "./file.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth-guard";

@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post("uploads")
  @UseInterceptors(FilesInterceptor("files"))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return this.fileService.uploadFiles(files);
  }

  @Delete("remove/:name")
  async removeFile(@Param("name") name: string): Promise<string> {
    return this.fileService.removeFile(name);
  }
}
