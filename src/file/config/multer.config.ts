import { MulterModuleOptions } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join } from "path";

export const multerConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: join(process.cwd(), "assets"),
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      const fileName = `${Date.now()}-${Math.round(Math.random() * 9)}.${extension}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 30,
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (allowedExtensions.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
};
