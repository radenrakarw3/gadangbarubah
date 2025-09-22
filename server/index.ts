import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { strictRateLimit, antiSpamSlowDown, botDetection, geoSecurity, honeypot, requestValidator } from "./security";
import { securityLoggingMiddleware, costMonitoringMiddleware } from "./monitoring";
import { getSEOConfigByPath, generateSEOTags } from "../shared/seo";

const app = express();

// Enable trust proxy for accurate IP detection (important for rate limiting)
app.set('trust proxy', 1);

// ULTRA PERMISSIVE HEADERS - NO BLOCKING WHATSOEVER
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["*", "'unsafe-inline'", "'unsafe-eval'", "data:", "blob:"],
      styleSrc: ["*", "'unsafe-inline'", "data:", "blob:"],
      fontSrc: ["*", "data:", "blob:"],
      imgSrc: ["*", "data:", "blob:"],
      scriptSrc: ["*", "'unsafe-inline'", "'unsafe-eval'", "data:", "blob:"],
      connectSrc: ["*", "data:", "blob:", "ws:", "wss:"],
      frameSrc: ["*"],
      objectSrc: ["*"],
      mediaSrc: ["*", "data:", "blob:"],
      workerSrc: ["*", "data:", "blob:"],
      childSrc: ["*", "data:", "blob:"],
      formAction: ["*"],
      frameAncestors: ["*"],
      baseUri: ["*"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
  hsts: false,
  referrerPolicy: false,
}));

// ALL SECURITY DISABLED FOR MAXIMUM CUSTOMER ACCESS
// app.use(securityLoggingMiddleware); // DISABLED - was causing log overhead
// app.use(costMonitoringMiddleware);  // DISABLED - was tracking and potentially blocking
// app.use(geoSecurity);            // DISABLED - was blocking legitimate customers
// app.use(botDetection);           // DISABLED - might be too aggressive
// app.use(strictRateLimit);        // DISABLED - was too restrictive (50 req/15min)
// app.use(antiSpamSlowDown);       // DISABLED - was adding delays to legitimate users
// app.use(requestValidator);       // DISABLED - was too aggressive on content validation
// app.use(honeypot);               // DISABLED - even minimal protection can interfere

app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// SEO Head injection middleware (only in production for real SEO benefits)
app.get("*", async (req, res, next) => {
  // Skip in development mode to avoid interfering with Vite HMR
  if (app.get("env") === "development") {
    return next();
  }
  
  // Skip API routes, static assets, and Vite-specific routes
  if (req.path.startsWith("/api") || 
      req.path.includes(".") || 
      req.path.startsWith("/src/") ||
      req.path.startsWith("/@") ||
      req.path.startsWith("/node_modules") ||
      req.path.startsWith("/assets/") ||
      req.path.endsWith(".tsx") ||
      req.path.endsWith(".ts") ||
      req.path.endsWith(".js") ||
      req.path.endsWith(".jsx")) {
    return next();
  }

  try {
    const clientTemplate = path.resolve(
      import.meta.dirname,
      "..",
      "client",
      "index.html",
    );

    // Read the HTML template
    let template = await fs.promises.readFile(clientTemplate, "utf-8");
    
    // Check if this template has SSR placeholders
    if (!template.includes("<!--ssr-helmet-")) {
      return next(); // Let normal flow handle it
    }

    // Get SEO config for this path
    const seoConfig = getSEOConfigByPath(req.path);
    const seoTags = generateSEOTags(seoConfig);
    
    // Set 404 status for unknown routes  
    if (seoConfig.title.includes("Halaman Tidak Ditemukan")) {
      res.status(404);
    }

    // Replace SSR placeholders with actual SEO content
    template = template.replace(`<!--ssr-helmet-title-->`, seoTags.title);
    template = template.replace(`<!--ssr-helmet-meta-->`, seoTags.meta);
    template = template.replace(`<!--ssr-helmet-link-->`, seoTags.link);
    template = template.replace(`<!--ssr-helmet-script-->`, seoTags.script);
    template = template.replace(`<!--ssr-outlet-->`, ""); // Empty for client rendering

    // Set appropriate headers
    res.status(200).set({ "Content-Type": "text/html" });
    res.send(template);
  } catch (error) {
    log(`SEO middleware error: ${error}`);
    next(); // Fall back to normal handling
  }
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
