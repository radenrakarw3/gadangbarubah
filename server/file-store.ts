import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import { uploadedFiles, type UploadedFile } from "@shared/schema";
import { requireDb } from "./db";

export const FILE_ROUTE_PREFIX = "/api/files/";

export async function saveUploadedFile(file: Express.Multer.File): Promise<string> {
  const db = requireDb();
  const [row] = await db
    .insert(uploadedFiles)
    .values({ mimeType: file.mimetype, size: file.size, data: file.buffer })
    .returning({ id: uploadedFiles.id });
  return `${FILE_ROUTE_PREFIX}${row.id}`;
}

export async function getUploadedFile(id: string): Promise<UploadedFile | undefined> {
  const db = requireDb();
  const [row] = await db.select().from(uploadedFiles).where(eq(uploadedFiles.id, id));
  return row;
}

/** Hapus file berdasarkan imagePath; mendukung path DB (/api/files/:id) dan path disk lama (/uploads/...). */
export async function deleteStoredFile(imagePath: string | null | undefined): Promise<void> {
  if (!imagePath) return;
  try {
    if (imagePath.startsWith(FILE_ROUTE_PREFIX)) {
      const id = imagePath.slice(FILE_ROUTE_PREFIX.length);
      await requireDb().delete(uploadedFiles).where(eq(uploadedFiles.id, id));
      return;
    }
    if (imagePath.startsWith("/uploads/")) {
      const fullPath = path.join(process.cwd(), imagePath.replace(/^\//, ""));
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Delete stored file error:", error);
  }
}
