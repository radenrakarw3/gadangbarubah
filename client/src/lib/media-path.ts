/** Path upload disk lama (ephemeral di Railway) — biasanya hilang setelah redeploy. */
export function isEphemeralDiskImagePath(imagePath: string | null | undefined): boolean {
  return Boolean(imagePath?.startsWith("/uploads/"));
}

/** Path blob persist di DB. */
export function isPersistedFilePath(imagePath: string | null | undefined): boolean {
  return Boolean(imagePath?.startsWith("/api/files/"));
}
