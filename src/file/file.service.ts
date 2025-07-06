import { BadRequestException, Injectable } from "@nestjs/common";
import { join } from "path";
import { existsSync, unlinkSync } from "fs";

@Injectable()
export class FileService {
  uploadDirName = "assets";
  uploadsDirPath = `${process.env.SERVER_URL}/${this.uploadDirName}`;

  uploadFiles(files: Express.Multer.File[]) {
    return files.map((file) => `${this.uploadsDirPath}/${file.filename}`);
  }

  async removeFile(name: string): Promise<string> {
    try {
      const filePath = join(this.uploadsDirPath, name);
      if (existsSync(filePath)) {
        console.log(filePath);
        unlinkSync(filePath);
        return name;
      }
    } catch (error) {
      throw new BadRequestException("Не удалось удалить файл");
    }
  }
}
