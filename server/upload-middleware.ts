import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sizeOf from 'image-size';
import type { Request } from 'express';

const uploadsDir = path.join(process.cwd(), 'uploads', 'campaigns');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `campaign-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype !== 'image/png') {
    return cb(new Error('Hanya file PNG yang diperbolehkan'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max
  }
});

export function validateImageDimensions(filePath: string): { valid: boolean; error?: string } {
  try {
    const buffer = fs.readFileSync(filePath);
    const dimensions = sizeOf(buffer);
    
    if (!dimensions.width || !dimensions.height) {
      return { valid: false, error: 'Tidak dapat membaca dimensi gambar' };
    }
    
    if (dimensions.width !== 600 || dimensions.height !== 600) {
      // Delete invalid file
      fs.unlinkSync(filePath);
      return { 
        valid: false, 
        error: `Ukuran gambar harus exactly 600x600px. File Anda: ${dimensions.width}x${dimensions.height}px` 
      };
    }
    
    return { valid: true };
  } catch (error) {
    // Delete file if validation fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { valid: false, error: 'Error validasi gambar' };
  }
}
