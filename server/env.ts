/** Railway injects env ini saat deploy — lebih andal daripada NODE_ENV saja */
export function isRailwayDeployed(): boolean {
  return Boolean(
    process.env.RAILWAY_ENVIRONMENT_NAME ||
      process.env.RAILWAY_SERVICE_ID ||
      process.env.RAILWAY_PROJECT_ID,
  );
}

/** Production: NODE_ENV=production ATAU berjalan di Railway */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production" || isRailwayDeployed();
}

export function isDevelopment(): boolean {
  return !isProduction();
}
