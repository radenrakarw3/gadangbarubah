import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import type { Server } from "http";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Load terpisah agar esbuild tidak membundel vite ke dist/index.js (production)
  const viteDevUrl = pathToFileURL(
    path.join(import.meta.dirname, "vite-dev.js"),
  ).href;
  const { setupViteDev } = await import(viteDevUrl);
  await setupViteDev(app, server);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
