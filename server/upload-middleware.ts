import multer from 'multer';
import sizeOf from 'image-size';
import type { Request } from 'express';

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype !== 'image/png') {
    return cb(new Error('Hanya file PNG yang diperbolehkan'));
  }
  cb(null, true);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max
  }
});

export function validateImageDimensions(buffer: Buffer): { valid: boolean; error?: string } {
  try {
    const dimensions = sizeOf(buffer);

    if (!dimensions.width || !dimensions.height) {
      return { valid: false, error: 'Tidak dapat membaca dimensi gambar' };
    }

    if (dimensions.width !== 600 || dimensions.height !== 600) {
      return {
        valid: false,
        error: `Ukuran gambar harus tepat 600x600px. File Anda: ${dimensions.width}x${dimensions.height}px`
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Error validasi gambar' };
  }
}
