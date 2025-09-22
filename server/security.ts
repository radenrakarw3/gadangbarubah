import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { Request, Response, NextFunction } from 'express';

// Aggressive rate limiting for non-authenticated users
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50, // Only 50 requests per window (very strict)
  message: {
    success: false,
    message: "Terlalu banyak permintaan. Coba lagi dalam 15 menit.",
    code: "RATE_LIMIT_EXCEEDED"
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for static assets but apply to API and pages
  skip: (req) => {
    const skipPaths = ['/assets/', '/public/', '.ico', '.png', '.jpg', '.css', '.js'];
    return skipPaths.some(path => req.url.includes(path));
  }
});

// Slow down suspicious rapid requests
export const antiSpamSlowDown = slowDown({
  windowMs: 5 * 60 * 1000, // 5 minutes
  delayAfter: 10, // Allow 10 requests per window at full speed
  delayMs: (hits) => (hits - 10) * 1000, // Add 1 second delay per request after 10th
  maxDelayMs: 10000, // Max 10 seconds delay
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false, // Count failed requests
});

// Bot detection based on User-Agent
export const botDetection = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent') || '';
  
  // Common bot patterns - allow legitimate browsers
  const botPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /curl/i,
    /wget/i,
    /python.*requests/i,
    /^$/,  // Empty user agent
    /phantomjs/i,
    /scrapy/i,
    /nutch/i
  ];

  const isBot = botPatterns.some(pattern => pattern.test(userAgent));
  
  if (isBot) {
    console.log(`🤖 Bot detected - User-Agent: ${userAgent}, IP: ${req.ip}`);
    return res.status(403).json({
      success: false,
      message: "Access denied",
      code: "BOT_DETECTED"
    });
  }

  next();
};

// Geographic and suspicious IP filtering
export const geoSecurity = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const forwardedFor = req.get('X-Forwarded-For');
  
  // Block common suspicious patterns
  const suspiciousPatterns = [
    /^10\./, // Internal networks trying to access
    /^192\.168\./, // Private networks  
    /^172\./, // Private networks
    /^127\./, // Localhost (except actual localhost)
  ];

  // Allow localhost for development
  if (ip === '::1' || ip === '127.0.0.1' || ip?.includes('localhost')) {
    return next();
  }

  // Check for suspicious IP patterns
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(ip || '') || pattern.test(forwardedFor || '')
  );

  if (isSuspicious && process.env.NODE_ENV === 'production') {
    console.log(`🚫 Suspicious IP blocked: ${ip}, X-Forwarded-For: ${forwardedFor}`);
    return res.status(403).json({
      success: false,
      message: "Access not allowed from this network",
      code: "GEO_BLOCKED"
    });
  }

  next();
};

// Honeypot middleware - detects automated form submissions
export const honeypot = (req: Request, res: Response, next: NextFunction) => {
  // Check for honeypot fields in POST requests
  if (req.method === 'POST' && req.body) {
    // Common honeypot field names
    const honeypotFields = ['website', 'url', 'email_confirmation', 'phone_confirm', 'address_line_3'];
    
    for (const field of honeypotFields) {
      if (req.body[field] && req.body[field].trim() !== '') {
        console.log(`🍯 Honeypot triggered - Field: ${field}, Value: ${req.body[field]}, IP: ${req.ip}`);
        return res.status(403).json({
          success: false,
          message: "Invalid form submission",
          code: "HONEYPOT_DETECTED"
        });
      }
    }
  }
  
  next();
};

// Request validation - check for malicious payloads
export const requestValidator = (req: Request, res: Response, next: NextFunction) => {
  const body = JSON.stringify(req.body || {});
  const query = JSON.stringify(req.query || {});
  const params = JSON.stringify(req.params || {});
  const fullRequest = `${body}${query}${params}`.toLowerCase();

  // Malicious patterns
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /eval\(/i,
    /union.*select/i,
    /drop.*table/i,
    /insert.*into/i,
    /delete.*from/i,
    /'.*or.*'.*='/i,
    /\.\.\/\.\.\//i, // Path traversal
    /cmd\.exe/i,
    /\/bin\/bash/i,
    /\/etc\/passwd/i
  ];

  const isMalicious = maliciousPatterns.some(pattern => pattern.test(fullRequest));
  
  if (isMalicious) {
    console.log(`💀 Malicious request blocked - IP: ${req.ip}, Payload: ${fullRequest.substring(0, 200)}...`);
    return res.status(403).json({
      success: false,
      message: "Malicious request detected",
      code: "MALICIOUS_REQUEST"
    });
  }

  next();
};

// Enhanced security for member endpoints
export const memberEndpointSecurity = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 3, // Very strict - only 3 attempts per 15 minutes
  message: {
    success: false,
    message: "Terlalu banyak percobaan akses member. Coba lagi dalam 15 menit.",
    code: "MEMBER_RATE_LIMIT"
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by IP + endpoint combination (IPv6 compatible)
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    return `${ip}-${req.path}`;
  }
});