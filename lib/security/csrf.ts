// CSRF (Cross-Site Request Forgery) protection
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

interface CSRFOptions {
  secret: string;
  cookieName?: string;
  headerName?: string;
  tokenLength?: number;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
  httpOnly?: boolean;
  maxAge?: number;
}

export class CSRFProtection {
  private options: Required<CSRFOptions>;

  constructor(options: CSRFOptions) {
    this.options = {
      cookieName: 'csrf-token',
      headerName: 'x-csrf-token',
      tokenLength: 32,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // Set to false so client can read it
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      ...options,
    };
  }

  // Generate CSRF token
  generateToken(): string {
    return crypto.randomBytes(this.options.tokenLength).toString('hex');
  }

  // Create HMAC signature for token
  private signToken(token: string): string {
    return crypto
      .createHmac('sha256', this.options.secret)
      .update(token)
      .digest('hex');
  }

  // Verify token signature
  private verifyToken(token: string, signature: string): boolean {
    const expectedSignature = this.signToken(token);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Set CSRF token in cookie
  setToken(res: NextApiResponse): string {
    const token = this.generateToken();
    const signature = this.signToken(token);
    const signedToken = `${token}.${signature}`;

    const cookieOptions = {
      maxAge: this.options.maxAge,
      httpOnly: this.options.httpOnly,
      secure: this.options.secure,
      sameSite: this.options.sameSite,
      path: '/',
    };

    // Set cookie header manually for more control
    const cookieValue = `${this.options.cookieName}=${signedToken}; Max-Age=${cookieOptions.maxAge}; Path=${cookieOptions.path}; SameSite=${cookieOptions.sameSite}`;
    const finalCookieValue = cookieOptions.secure ? `${cookieValue}; Secure` : cookieValue;
    
    res.setHeader('Set-Cookie', finalCookieValue);
    
    return token; // Return unsigned token for client use
  }

  // Verify CSRF token
  verifyRequest(req: NextApiRequest): boolean {
    // Skip verification for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method || '')) {
      return true;
    }

    // Get token from header
    const headerToken = req.headers[this.options.headerName] as string;
    
    // Get token from cookie
    const cookies = this.parseCookies(req.headers.cookie || '');
    const cookieToken = cookies[this.options.cookieName];

    if (!headerToken || !cookieToken) {
      return false;
    }

    // Parse signed token from cookie
    const [token, signature] = cookieToken.split('.');
    if (!token || !signature) {
      return false;
    }

    // Verify signature
    if (!this.verifyToken(token, signature)) {
      return false;
    }

    // Verify header token matches cookie token
    return crypto.timingSafeEqual(
      Buffer.from(headerToken),
      Buffer.from(token)
    );
  }

  // Parse cookies from header string
  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });

    return cookies;
  }

  // Middleware for automatic CSRF protection
  middleware() {
    return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
      // Set CSRF token for GET requests
      if (req.method === 'GET') {
        this.setToken(res);
        return next();
      }

      // Verify CSRF token for unsafe methods
      if (!this.verifyRequest(req)) {
        return res.status(403).json({
          error: 'CSRF token validation failed',
          code: 'CSRF_TOKEN_INVALID',
        });
      }

      next();
    };
  }
}

// Security headers middleware
export function securityHeaders() {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.nutriwise.app https://analytics.google.com",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ');
    
    res.setHeader('Content-Security-Policy', csp);
    
    // Strict Transport Security (HTTPS only)
    if (req.headers['x-forwarded-proto'] === 'https' || req.connection.encrypted) {
      res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    }
    
    // Permissions Policy
    const permissionsPolicy = [
      'camera=()',
      'microphone=()',
      'location=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', ');
    
    res.setHeader('Permissions-Policy', permissionsPolicy);
    
    next();
  };
}

// Rate limiting with CSRF protection
export function withCSRF(options: CSRFOptions) {
  const csrf = new CSRFProtection(options);
  
  return (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      // Apply security headers
      securityHeaders()(req, res, () => {});
      
      // Apply CSRF protection
      csrf.middleware()(req, res, async () => {
        try {
          await handler(req, res);
        } catch (error) {
          console.error('API handler error:', error);
          res.status(500).json({
            error: 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { details: error.message }),
          });
        }
      });
    };
  };
}

// React hook for CSRF token management
export function useCSRFToken() {
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Get CSRF token from cookie
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = decodeURIComponent(value || '');
      return acc;
    }, {} as Record<string, string>);

    const csrfCookie = cookies['csrf-token'];
    if (csrfCookie) {
      // Extract token part (before the signature)
      const [tokenPart] = csrfCookie.split('.');
      setToken(tokenPart);
    }

    // Fetch token if not available
    if (!csrfCookie) {
      fetch('/api/csrf-token')
        .then(res => res.json())
        .then(data => setToken(data.token))
        .catch(console.error);
    }
  }, []);

  return token;
}

// Enhanced fetch with CSRF protection
export async function csrfFetch(url: string, options: RequestInit = {}) {
  // Get CSRF token from cookie
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = decodeURIComponent(value || '');
    return acc;
  }, {} as Record<string, string>);

  const csrfCookie = cookies['csrf-token'];
  let csrfToken = '';

  if (csrfCookie) {
    [csrfToken] = csrfCookie.split('.');
  }

  // Add CSRF token to headers for unsafe methods
  const method = options.method || 'GET';
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase()) && csrfToken) {
    options.headers = {
      ...options.headers,
      'x-csrf-token': csrfToken,
    };
  }

  return fetch(url, options);
}

// CSRF token endpoint
export const csrfTokenHandler = withCSRF({
  secret: process.env.CSRF_SECRET || 'your-csrf-secret-key',
})(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // Token is already set by middleware
    res.json({ message: 'CSRF token set' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
});

export default CSRFProtection;