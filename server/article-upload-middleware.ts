import multer from "multer";
import type { Request } from "express";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return cb(new Error("Hanya file JPEG, PNG, atau WebP yang diperbolehkan"));
  }
  cb(null, true);
};

export const articleUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});
