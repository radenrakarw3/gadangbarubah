import { Request, Response, NextFunction } from 'express';

interface SecurityEvent {
  timestamp: number;
  type: string;
  ip: string;
  userAgent: string;
  details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events
  private suspiciousIPs = new Map<string, number>();
  private blockedIPs = new Set<string>();
  
  logEvent(req: Request, type: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') {
    const event: SecurityEvent = {
      timestamp: Date.now(),
      type,
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      details,
      severity
    };
    
    this.events.push(event);
    
    // Keep only last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    // Track suspicious activity
    this.trackSuspiciousActivity(event);
    
    // Log to console for monitoring
    const timestamp = new Date(event.timestamp).toISOString();
    console.log(`🔒 [SECURITY] ${timestamp} | ${severity.toUpperCase()} | ${type} | IP: ${event.ip} | ${JSON.stringify(details)}`);
  }
  
  private trackSuspiciousActivity(event: SecurityEvent) {
    const { ip, severity } = event;
    
    // Increase suspicion score based on severity
    const suspiciousScore = {
      low: 1,
      medium: 3,
      high: 7,
      critical: 15
    }[severity];
    
    const currentScore = this.suspiciousIPs.get(ip) || 0;
    const newScore = currentScore + suspiciousScore;
    
    this.suspiciousIPs.set(ip, newScore);
    
    // Auto-block IPs with high suspicion scores
    if (newScore > 50) {
      this.blockedIPs.add(ip);
      console.log(`🚫 [SECURITY] Auto-blocked highly suspicious IP: ${ip} (score: ${newScore})`);
    }
  }
  
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }
  
  getRecentEvents(limit = 50): SecurityEvent[] {
    return this.events.slice(-limit);
  }
  
  getSuspiciousIPs(): Array<{ ip: string; score: number }> {
    return Array.from(this.suspiciousIPs.entries())
      .map(([ip, score]) => ({ ip, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }
  
  getStats() {
    const now = Date.now();
    const lastHour = now - (60 * 60 * 1000);
    const lastDay = now - (24 * 60 * 60 * 1000);
    
    const eventsLastHour = this.events.filter(e => e.timestamp > lastHour);
    const eventsLastDay = this.events.filter(e => e.timestamp > lastDay);
    
    return {
      totalEvents: this.events.length,
      eventsLastHour: eventsLastHour.length,
      eventsLastDay: eventsLastDay.length,
      blockedIPs: this.blockedIPs.size,
      suspiciousIPs: this.suspiciousIPs.size,
      topThreats: eventsLastDay
        .filter(e => e.severity === 'high' || e.severity === 'critical')
        .slice(0, 10)
    };
  }
}

export const securityMonitor = new SecurityMonitor();

// Enhanced security middleware with monitoring
export const securityLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if IP is auto-blocked
  if (securityMonitor.isIPBlocked(req.ip || '')) {
    securityMonitor.logEvent(req, 'BLOCKED_IP_ACCESS_ATTEMPT', { 
      path: req.path,
      method: req.method 
    }, 'critical');
    
    return res.status(403).json({
      success: false,
      message: "Access denied",
      code: "IP_BLOCKED"
    });
  }
  
  next();
};

// Cost monitoring - track expensive operations
export const costMonitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const path = req.path;
    
    // Log expensive operations (> 1 second)
    if (duration > 1000) {
      securityMonitor.logEvent(req, 'EXPENSIVE_OPERATION', {
        path,
        method: req.method,
        duration: `${duration}ms`,
        statusCode: res.statusCode
      }, 'medium');
    }
    
    // Log failed requests from same IP (potential attack)
    if (res.statusCode >= 400) {
      securityMonitor.logEvent(req, 'FAILED_REQUEST', {
        path,
        method: req.method,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      }, res.statusCode >= 500 ? 'high' : 'low');
    }
  });
  
  next();
};