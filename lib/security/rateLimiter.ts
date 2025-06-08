// Rate limiting middleware for API protection
import { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: NextApiRequest) => string;
  onLimitReached?: (req: NextApiRequest, res: NextApiResponse) => void;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: RateLimitConfig) {
    this.config = {
      message: 'Too many requests, please try again later.',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: this.defaultKeyGenerator,
      ...config,
    };

    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  private defaultKeyGenerator(req: NextApiRequest): string {
    // Use IP address as default key
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded 
      ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
      : req.socket.remoteAddress || 'unknown';
    
    return `${ip}:${req.url}`;
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  middleware() {
    return async (
      req: NextApiRequest,
      res: NextApiResponse,
      next: () => void | Promise<void>
    ) => {
      const key = this.config.keyGenerator!(req);
      const now = Date.now();
      
      // Initialize or reset if window expired
      if (!this.store[key] || this.store[key].resetTime < now) {
        this.store[key] = {
          count: 0,
          resetTime: now + this.config.windowMs,
        };
      }

      // Check if limit exceeded
      if (this.store[key].count >= this.config.maxRequests) {
        const resetTimeSeconds = Math.ceil((this.store[key].resetTime - now) / 1000);
        
        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', this.config.maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', this.store[key].resetTime);
        res.setHeader('Retry-After', resetTimeSeconds);

        if (this.config.onLimitReached) {
          this.config.onLimitReached(req, res);
        }

        return res.status(429).json({
          error: this.config.message,
          retryAfter: resetTimeSeconds,
        });
      }

      // Increment counter
      this.store[key].count++;

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', this.config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.config.maxRequests - this.store[key].count));
      res.setHeader('X-RateLimit-Reset', this.store[key].resetTime);

      // Continue to next middleware
      try {
        await next();
        
        // Optionally skip counting successful requests
        if (this.config.skipSuccessfulRequests && res.statusCode < 400) {
          this.store[key].count--;
        }
      } catch (error) {
        // Optionally skip counting failed requests
        if (this.config.skipFailedRequests) {
          this.store[key].count--;
        }
        throw error;
      }
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store = {};
  }
}

// Predefined rate limiters
export const createStrictRateLimiter = () => new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per 15 minutes
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

export const createAuthRateLimiter = () => new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 auth attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  keyGenerator: (req) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    return `auth:${ip}`;
  },
});

export const createAPIRateLimiter = () => new RateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  message: 'API rate limit exceeded, please slow down.',
});

export const createUploadRateLimiter = () => new RateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 5, // 5 uploads per minute
  message: 'Upload rate limit exceeded, please wait before uploading again.',
});

// Advanced rate limiter with different tiers
export class TieredRateLimiter {
  private limiters: Map<string, RateLimiter> = new Map();

  constructor(private tiers: Record<string, RateLimitConfig>) {
    Object.entries(tiers).forEach(([tier, config]) => {
      this.limiters.set(tier, new RateLimiter(config));
    });
  }

  middleware(tierSelector: (req: NextApiRequest) => string) {
    return async (
      req: NextApiRequest,
      res: NextApiResponse,
      next: () => void | Promise<void>
    ) => {
      const tier = tierSelector(req);
      const limiter = this.limiters.get(tier);
      
      if (!limiter) {
        throw new Error(`Unknown rate limit tier: ${tier}`);
      }

      return limiter.middleware()(req, res, next);
    };
  }

  destroy() {
    this.limiters.forEach(limiter => limiter.destroy());
    this.limiters.clear();
  }
}

// User-based rate limiting
export const createUserRateLimiter = () => new RateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute per user
  keyGenerator: (req) => {
    // Extract user ID from token or session
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      // In a real app, decode JWT to get user ID
      return `user:${token.substring(0, 10)}`;
    }
    // Fallback to IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    return `ip:${ip}`;
  },
});

// Export rate limiters
export { RateLimiter };

// Helper function to apply rate limiting to API routes
export function withRateLimit(config: RateLimitConfig) {
  const limiter = new RateLimiter(config);
  
  return (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const middleware = limiter.middleware();
      
      return new Promise<void>((resolve, reject) => {
        middleware(req, res, async () => {
          try {
            await handler(req, res);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    };
  };
}

// Distributed rate limiter using Redis (for production)
export class RedisRateLimiter {
  constructor(private redis: any, private config: RateLimitConfig) {}

  async isAllowed(key: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const window = Math.floor(now / this.config.windowMs);
    const redisKey = `rate_limit:${key}:${window}`;

    const current = await this.redis.incr(redisKey);
    
    if (current === 1) {
      await this.redis.expire(redisKey, Math.ceil(this.config.windowMs / 1000));
    }

    const resetTime = (window + 1) * this.config.windowMs;
    const remaining = Math.max(0, this.config.maxRequests - current);
    const allowed = current <= this.config.maxRequests;

    return { allowed, remaining, resetTime };
  }
}