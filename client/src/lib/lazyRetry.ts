import { lazy, type ComponentType, type LazyExoticComponent } from "react";

/**
 * Lazy import dengan retry — mengurangi layar kosong saat chunk gagal
 * (jaringan lambat / cache deploy lama).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyRetry<T extends ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await importer();
      } catch (err) {
        lastError = err;
        if (attempt < 2) {
          await new Promise((r) => window.setTimeout(r, 600 * (attempt + 1)));
        }
      }
    }
    throw lastError;
  });
}
