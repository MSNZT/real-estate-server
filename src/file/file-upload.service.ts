import { Injectable } from "@nestjs/common";

@Injectable()
export class FileUploadService {
  url = process.env.SERVER_URL;
  prefix = "files";
  uploadFile(files: Express.Multer.File[]) {
    return files.map((file) => `${this.url}/${this.prefix}/${file.filename}`);
  }
}
